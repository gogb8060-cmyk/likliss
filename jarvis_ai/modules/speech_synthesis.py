"""
Модуль синтеза речи JARVIS AI
Преобразование текста в речь с различными движками
"""
import pyttsx3
from gtts import gTTS
from typing import Optional
import tempfile
import os
from pathlib import Path

from config.settings import TTS_ENGINE, TTS_RATE, TTS_VOLUME, TTS_VOICE_GENDER, VOICE_LANGUAGE
from utils.logger import log


class SpeechSynthesis:
    """Модуль синтеза речи"""
    
    def __init__(self, engine_name: str = TTS_ENGINE):
        self.engine_name = engine_name
        self.pyttsx3_engine = None
        self.language = VOICE_LANGUAGE.split('-')[0]  # 'ru' из 'ru-RU'
        
        if engine_name == "pyttsx3":
            self._init_pyttsx3()
        
        log.info(f"Модуль синтеза речи инициализирован (движок: {engine_name})")
    
    def _init_pyttsx3(self):
        """Инициализация pyttsx3 движка"""
        try:
            self.pyttsx3_engine = pyttsx3.init()
            
            # Настройка скорости
            self.pyttsx3_engine.setProperty('rate', TTS_RATE)
            
            # Настройка громкости
            self.pyttsx3_engine.setProperty('volume', TTS_VOLUME)
            
            # Выбор голоса
            self._set_voice(TTS_VOICE_GENDER)
            
            log.debug(" pyttsx3 движок инициализирован")
        except Exception as e:
            log.error(f"Ошибка инициализации pyttsx3: {e}")
            self.engine_name = "gtts"  # Переключение на gTTS
    
    def _set_voice(self, gender: str = "male"):
        """Выбор голоса по полу"""
        if not self.pyttsx3_engine:
            return
        
        voices = self.pyttsx3_engine.getProperty('voices')
        
        # Поиск подходящего голоса
        selected_voice = None
        
        for voice in voices:
            voice_name = voice.name.lower()
            voice_langs = getattr(voice, 'languages', [])
            
            # Проверка языка
            if self.language not in str(voice_langs).lower() and 'russian' not in voice_name and 'russian' not in str(voice_langs).lower():
                continue
            
            # Проверка пола
            if gender == "male" and ("male" in voice_name or "мужской" in voice_name):
                selected_voice = voice.id
                break
            elif gender == "female" and ("female" in voice_name or "женский" in voice_name):
                selected_voice = voice.id
                break
        
        # Если не нашли по полу, берем первый подходящий по языку
        if not selected_voice:
            for voice in voices:
                voice_langs = getattr(voice, 'languages', [])
                if self.language in str(voice_langs).lower() or 'russian' in str(voice_langs).lower():
                    selected_voice = voice.id
                    break
        
        if selected_voice:
            self.pyttsx3_engine.setProperty('voice', selected_voice)
            log.debug(f"Выбран голос: {selected_voice}")
        else:
            log.warning("Подходящий голос не найден, используется голос по умолчанию")
    
    def speak(self, text: str, use_async: bool = False):
        """Озвучивание текста"""
        if not text:
            return
        
        log.debug(f"Озвучиваю: {text[:50]}...")
        
        try:
            if self.engine_name == "pyttsx3" and self.pyttsx3_engine:
                self._speak_pyttsx3(text, use_async)
            else:
                self._speak_gtts(text)
        except Exception as e:
            log.error(f"Ошибка синтеза речи: {e}")
    
    def _speak_pyttsx3(self, text: str, use_async: bool = False):
        """Озвучивание через pyttsx3"""
        if use_async:
            self.pyttsx3_engine.say(text)
            self.pyttsx3_engine.runAndWait()
        else:
            self.pyttsx3_engine.say(text)
            self.pyttsx3_engine.runAndWait()
    
    def _speak_gtts(self, text: str):
        """Озвучивание через Google Text-to-Speech"""
        try:
            tts = gTTS(text=text, lang=self.language, slow=False)
            
            # Сохранение во временный файл
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
                temp_file = fp.name
            
            tts.save(temp_file)
            
            # Воспроизведение
            self._play_audio_file(temp_file)
            
            # Удаление временного файла
            os.unlink(temp_file)
            
        except Exception as e:
            log.error(f"Ошибка gTTS: {e}")
            # Fallback: просто вывод текста
            print(f"[JARVIS]: {text}")
    
    def _play_audio_file(self, file_path: str):
        """Воспроизведение аудиофайла"""
        try:
            # Попытка использования playsound
            from playsound import playsound
            playsound(file_path)
        except ImportError:
            # Альтернативные методы воспроизведения
            import subprocess
            
            try:
                # Linux
                subprocess.call(['aplay', file_path])
            except FileNotFoundError:
                try:
                    # macOS
                    subprocess.call(['afplay', file_path])
                except FileNotFoundError:
                    # Windows
                    os.startfile(file_path)
            except Exception as e:
                log.warning(f"Не удалось воспроизвести аудио: {e}")
    
    def list_voices(self) -> list:
        """Список доступных голосов"""
        if not self.pyttsx3_engine:
            return []
        
        voices = []
        for voice in self.pyttsx3_engine.getProperty('voices'):
            voices.append({
                'id': voice.id,
                'name': voice.name,
                'languages': getattr(voice, 'languages', []),
                'gender': getattr(voice, 'gender', 'unknown')
            })
        
        return voices
    
    def set_rate(self, rate: int):
        """Установка скорости речи"""
        if self.pyttsx3_engine:
            self.pyttsx3_engine.setProperty('rate', rate)
            log.debug(f"Скорость речи установлена: {rate}")
    
    def set_volume(self, volume: float):
        """Установка громкости (0.0 - 1.0)"""
        if self.pyttsx3_engine:
            self.pyttsx3_engine.setProperty('volume', max(0.0, min(1.0, volume)))
            log.debug(f"Громкость установлена: {volume}")
    
    def save_to_file(self, text: str, output_path: str):
        """Сохранение речи в файл"""
        try:
            if self.engine_name == "pyttsx3" and self.pyttsx3_engine:
                # pyttsx3 не поддерживает прямое сохранение в файл
                # Используем gTTS как альтернативу
                tts = gTTS(text=text, lang=self.language, slow=False)
                tts.save(output_path)
                log.info(f"Речь сохранена в файл: {output_path}")
            else:
                tts = gTTS(text=text, lang=self.language, slow=False)
                tts.save(output_path)
                log.info(f"Речь сохранена в файл: {output_path}")
        except Exception as e:
            log.error(f"Ошибка сохранения в файл: {e}")
