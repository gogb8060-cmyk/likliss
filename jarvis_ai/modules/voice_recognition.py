"""
Модуль распознавания речи JARVIS AI
Поддержка множественных движков распознавания
"""
import speech_recognition as sr
from typing import Optional, List
import threading

from config.settings import (
    VOICE_LANGUAGE, 
    SPEECH_RECOGNITION_TIMEOUT,
    SPEECH_RECOGNITION_PHRASE_TIME_LIMIT,
    VOICE_ACTIVATION_KEYWORD
)
from utils.logger import log


class VoiceRecognition:
    """Модуль распознавания речи"""
    
    def __init__(self, language: str = VOICE_LANGUAGE):
        self.recognizer = sr.Recognizer()
        self.microphone = None
        self.language = language
        self.is_listening = False
        self.activation_keyword = VOICE_ACTIVATION_KEYWORD.lower()
        
        # Настройки распознавания
        self.recognizer.energy_threshold = 4000
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 0.8
        
        log.info("Модуль распознавания речи инициализирован")
    
    def init_microphone(self) -> bool:
        """Инициализация микрофона"""
        try:
            self.microphone = sr.Microphone()
            
            # Калибровка уровня шума
            with self.microphone as source:
                log.info("Калибровка микрофона... Пожалуйста, помолчите.")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                log.info("Калибровка завершена")
            
            return True
        except Exception as e:
            log.error(f"Ошибка инициализации микрофона: {e}")
            return False
    
    def listen(self, timeout: int = SPEECH_RECOGNITION_TIMEOUT,
               phrase_time_limit: int = SPEECH_RECOGNITION_PHRASE_TIME_LIMIT) -> Optional[str]:
        """Прослушивание речи и распознавание"""
        if not self.microphone:
            if not self.init_microphone():
                return None
        
        try:
            with self.microphone as source:
                log.debug("Слушаю...")
                audio = self.recognizer.listen(
                    source,
                    timeout=timeout,
                    phrase_time_limit=phrase_time_limit
                )
            
            return self._recognize_audio(audio)
            
        except sr.WaitTimeoutError:
            log.warning("Превышено время ожидания речи")
            return None
        except Exception as e:
            log.error(f"Ошибка при прослушивании: {e}")
            return None
    
    def _recognize_audio(self, audio: sr.AudioData) -> Optional[str]:
        """Распознавание аудио с использованием различных движков"""
        
        # Приоритет: Google Cloud -> Sphinx -> Google (бесплатный)
        
        # 1. Попытка использования Google Speech Recognition (бесплатно)
        try:
            text = self.recognizer.recognize_google(audio, language=self.language)
            log.debug(f"Распознано (Google): {text}")
            return text
        except sr.UnknownValueError:
            log.debug("Речь не распознана")
        except sr.RequestError as e:
            log.warning(f"Ошибка сервиса Google: {e}")
        
        # 2. Попытка использования PocketSphinx (оффлайн)
        try:
            text = self.recognizer.recognize_sphinx(audio, language=self.language)
            log.debug(f"Распознано (Sphinx): {text}")
            return text
        except sr.UnknownValueError:
            pass
        except Exception as e:
            log.warning(f"Ошибка Sphinx: {e}")
        
        return None
    
    def listen_for_keyword(self) -> bool:
        """Ожидание ключевого слова активации"""
        log.info(f"Ожидание ключевого слова '{self.activation_keyword}'...")
        
        while True:
            text = self.listen(timeout=3, phrase_time_limit=2)
            
            if text:
                text_lower = text.lower()
                if self.activation_keyword in text_lower:
                    log.info(f"Ключевое слово распознано: {text}")
                    return True
                
                log.debug(f"Игнорирую: {text}")
    
    def start_continuous_listening(self, callback):
        """Непрерывное прослушивание с колбэком"""
        self.is_listening = True
        
        def listen_loop():
            while self.is_listening:
                text = self.listen()
                if text:
                    callback(text)
        
        thread = threading.Thread(target=listen_loop, daemon=True)
        thread.start()
        log.info("Непрерывное прослушивание запущено")
    
    def stop_listening(self):
        """Остановка прослушивания"""
        self.is_listening = False
        log.info("Прослушивание остановлено")
    
    def list_microphones(self) -> List[dict]:
        """Список доступных микрофонов"""
        microphones = []
        
        for index, name in enumerate(sr.Microphone.list_microphone_names()):
            microphones.append({
                'index': index,
                'name': name
            })
            log.debug(f"Микрофон {index}: {name}")
        
        return microphones
    
    def set_microphone(self, device_index: int):
        """Выбор конкретного микрофона"""
        try:
            self.microphone = sr.Microphone(device_index=device_index)
            log.info(f"Выбран микрофон: {device_index}")
            return True
        except Exception as e:
            log.error(f"Ошибка выбора микрофона: {e}")
            return False
    
    def test_microphone(self) -> bool:
        """Тестирование микрофона"""
        log.info("Тестирование микрофона... Скажите что-нибудь.")
        
        if not self.microphone:
            if not self.init_microphone():
                return False
        
        try:
            with self.microphone as source:
                audio = self.recognizer.listen(source, timeout=5)
            
            # Проверка, что аудио записано
            if len(audio.frame_data) > 0:
                log.info("Микрофон работает корректно")
                return True
            else:
                log.warning("Микрофон не записал звук")
                return False
                
        except sr.WaitTimeoutError:
            log.warning("Никакой звук не был записан")
            return False
        except Exception as e:
            log.error(f"Ошибка тестирования: {e}")
            return False
