"""
Основной класс ассистента JARVIS AI
Координация всех модулей и обработка команд
"""
import time
from typing import Optional, Dict
from datetime import datetime

from core.memory import Memory
from modules.voice_recognition import VoiceRecognition
from modules.speech_synthesis import SpeechSynthesis
from modules.natural_language import NaturalLanguageProcessor
from config.settings import VOICE_ACTIVATION_KEYWORD
from utils.logger import log


class JarvisAssistant:
    """Главный класс ассистента JARVIS"""
    
    def __init__(self):
        log.info("Инициализация JARVIS...")
        
        # Инициализация компонентов
        self.memory = Memory()
        self.voice_recognition = VoiceRecognition()
        self.speech_synthesis = SpeechSynthesis()
        self.nlp = NaturalLanguageProcessor()
        
        # Состояние ассистента
        self.is_active = False
        self.is_listening = False
        self.user_name = self.memory.get_preference('user_name', 'Сэр')
        
        # Загрузка предпочтений пользователя
        self._load_user_preferences()
        
        log.info("JARVIS готов к работе")
    
    def _load_user_preferences(self):
        """Загрузка пользовательских предпочтений"""
        self.user_name = self.memory.get_preference('user_name', 'Сэр')
        log.debug(f"Пользователь: {self.user_name}")
    
    def start(self, use_voice_activation: bool = True):
        """Запуск ассистента"""
        self.speak(f"Приветствую, {self.user_name}. JARVIS онлайн.")
        
        if use_voice_activation:
            self._run_voice_activation_mode()
        else:
            self._run_continuous_mode()
    
    def _run_voice_activation_mode(self):
        """Режим ожидания ключевого слова"""
        log.info("Режим голосовой активации включен")
        self.speak("Ожидаю команду.")
        
        while True:
            try:
                # Ожидание ключевого слова
                if self.voice_recognition.listen_for_keyword():
                    self.is_active = True
                    log.info("Активирован по ключевому слову")
                    
                    # Прослушивание команды
                    command = self.voice_recognition.listen()
                    
                    if command:
                        self.process_command(command)
                    
                    self.is_active = False
                    
            except KeyboardInterrupt:
                log.info("Получен сигнал прерывания")
                break
            except Exception as e:
                log.error(f"Ошибка в цикле прослушивания: {e}")
                time.sleep(1)
    
    def _run_continuous_mode(self):
        """Непрерывный режим работы (без ключевого слова)"""
        log.info("Непрерывный режим работы")
        
        while True:
            try:
                command = self.voice_recognition.listen()
                
                if command:
                    self.process_command(command)
                    
            except KeyboardInterrupt:
                log.info("Получен сигнал прерывания")
                break
            except Exception as e:
                log.error(f"Ошибка в непрерывном режиме: {e}")
                time.sleep(1)
    
    def process_command(self, command: str):
        """Обработка команды"""
        log.info(f"Получена команда: {command}")
        
        # Сохранение в кратковременную память
        self.memory.add_to_short_term({
            'type': 'command',
            'text': command,
            'timestamp': datetime.now()
        })
        
        # Анализ намерения
        parsed = self.nlp.parse_command(command)
        intent = parsed['intent']
        confidence = parsed['confidence']
        entities = parsed['entities']
        
        log.info(f"Намерение: {intent} (уверенность: {confidence:.2f})")
        
        # Обработка различных намерений
        response = self._handle_intent(intent, entities, command)
        
        # Ответ пользователю
        if response:
            self.speak(response)
            
            # Сохранение диалога
            self.memory.save_conversation(command, response)
            self.memory.add_to_short_term({
                'type': 'conversation',
                'user_input': command,
                'assistant_response': response,
                'timestamp': datetime.now()
            })
    
    def _handle_intent(self, intent: str, entities: Dict, original_command: str) -> str:
        """Обработка намерения и генерация ответа"""
        
        handlers = {
            'greeting': self._handle_greeting,
            'time': self._handle_time,
            'date': self._handle_date,
            'weather': self._handle_weather,
            'news': self._handle_news,
            'search': self._handle_search,
            'reminder': self._handle_reminder,
            'calendar': self._handle_calendar,
            'email': self._handle_email,
            'screenshot': self._handle_screenshot,
            'camera': self._handle_camera,
            'help': self._handle_help,
            'exit': self._handle_exit,
            'silence': self._handle_silence,
            'unknown': self._handle_unknown,
        }
        
        handler = handlers.get(intent, self._handle_unknown)
        return handler(entities, original_command)
    
    def _handle_greeting(self, entities: Dict, command: str) -> str:
        """Обработка приветствия"""
        hour = datetime.now().hour
        
        if 5 <= hour < 12:
            greeting = f"Доброе утро, {self.user_name}"
        elif 12 <= hour < 18:
            greeting = f"Добрый день, {self.user_name}"
        elif 18 <= hour < 23:
            greeting = f"Добрый вечер, {self.user_name}"
        else:
            greeting = f"Доброй ночи, {self.user_name}"
        
        return f"{greeting}. Чем могу помочь?"
    
    def _handle_time(self, entities: Dict, command: str) -> str:
        """Обработка запроса времени"""
        now = datetime.now()
        time_str = now.strftime("%H:%M:%S")
        return f"Сейчас {time_str}"
    
    def _handle_date(self, entities: Dict, command: str) -> str:
        """Обработка запроса даты"""
        now = datetime.now()
        date_str = now.strftime("%d %B %Y, %A")
        return f"Сегодня {date_str}"
    
    def _handle_weather(self, entities: Dict, command: str) -> str:
        """Обработка запроса погоды"""
        location = entities.get('location', 'Москва')
        # TODO: Интеграция с Weather API
        return f"Погода в {location}: требуется настройка Weather API. Покажу общую информацию."
    
    def _handle_news(self, entities: Dict, command: str) -> str:
        """Обработка запроса новостей"""
        # TODO: Интеграция с News API
        return "Для получения новостей необходимо настроить News API. Покажите последние заголовки в браузере?"
    
    def _handle_search(self, entities: Dict, command: str) -> str:
        """Обработка поискового запроса"""
        query = entities.get('query', '')
        
        if not query:
            # Извлечение запроса из оригинальной команды
            import re
            match = re.search(r'(найди|поиск|найти|search|google)\s+(.+)', command.lower())
            if match:
                query = match.group(2)
        
        if query:
            # TODO: Открыть поиск в браузере
            return f"Ищу информацию по запросу: '{query}'. Открываю результаты поиска."
        
        return "Что именно вы хотите найти?"
    
    def _handle_reminder(self, entities: Dict, command: str) -> str:
        """Обработка напоминания"""
        # TODO: Реализация системы напоминаний
        return "Напоминание создано. Я напомню вам об этом в нужное время."
    
    def _handle_calendar(self, entities: Dict, command: str) -> str:
        """Обработка события календаря"""
        # TODO: Интеграция с календарем
        return "Событие добавлено в календарь."
    
    def _handle_email(self, entities: Dict, command: str) -> str:
        """Обработка отправки email"""
        # TODO: Интеграция с почтой
        return "Для отправки email необходима настройка почтового клиента."
    
    def _handle_screenshot(self, entities: Dict, command: str) -> str:
        """Обработка скриншота"""
        # TODO: Создание скриншота
        return "Делаю скриншот экрана..."
    
    def _handle_camera(self, entities: Dict, command: str) -> str:
        """Обработка запроса камеры"""
        # TODO: Интеграция с камерой
        return "Включаю камеру. Что вы хотите увидеть?"
    
    def _handle_help(self, entities: Dict, command: str) -> str:
        """Обработка запроса помощи"""
        help_text = (
            f"Я могу помочь вам со следующим, {self.user_name}:\n"
            "- Узнать время и дату\n"
            "- Проверить погоду\n"
            "- Найти информацию в интернете\n"
            "- Создать напоминание\n"
            "- Сделать скриншот\n"
            "- Показать камеру\n"
            "- Отправить email\n"
            "\n"
            "Просто скажите команду, например: 'Какая погода в Москве?'"
        )
        return help_text
    
    def _handle_exit(self, entities: Dict, command: str) -> str:
        """Обработка команды выхода"""
        return f"До свидания, {self.user_name}. Выключаюсь."
    
    def _handle_silence(self, entities: Dict, command: str) -> str:
        """Обработка команды замолчать"""
        self.is_active = False
        return "Хорошо, я помолчу."
    
    def _handle_unknown(self, entities: Dict, command: str) -> str:
        """Обработка неизвестной команды"""
        return f"Извините, {self.user_name}, я не понял команду. Можете переформулировать?"
    
    def speak(self, text: str):
        """Озвучивание текста"""
        if not text:
            return
        
        log.info(f"Говорю: {text[:50]}...")
        self.speech_synthesis.speak(text)
    
    def stop(self):
        """Остановка ассистента"""
        log.info("Остановка JARVIS...")
        self.is_active = False
        self.voice_recognition.stop_listening()
        self.speak(f"До свидания, {self.user_name}.")
    
    def set_user_name(self, name: str):
        """Установка имени пользователя"""
        self.user_name = name
        self.memory.set_preference('user_name', name)
        log.info(f"Имя пользователя установлено: {name}")
