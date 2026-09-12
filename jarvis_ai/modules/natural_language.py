"""
Модуль обработки естественного языка JARVIS AI
Понимание команд, извлечение намерений и сущностей
"""
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime

from utils.logger import log


class NaturalLanguageProcessor:
    """Обработка естественного языка и понимание команд"""
    
    def __init__(self):
        # Паттерны для различных команд
        self.command_patterns = {
            'greeting': [
                r'привет\s*джарвис',
                r'здравствуй',
                r'добрый\s*(день|утро|вечер)',
                r'hello\s*jarvis',
                r'^привет$',  # Добавлено: просто "привет"
            ],
            'time': [
                r'который\s*час',
                r'сколько\s*времени',
                r'покажи\s*время',
                r'what\s*time',
                r'current\s*time',
            ],
            'date': [
                r'какое\s*число',
                r'какой\s*сегодня\s*день',
                r'what\s*date',
                r'today\s*is',
                r'какое\s*сегодня\s*число',  # Добавлено: полное выражение
            ],
            'weather': [
                r'погода\s*(в\s*\w+)?',
                r'прогноз\s*погоды',
                r'weather\s*(in\s*\w+)?',
            ],
            'news': [
                r'новости',
                r'что\s*нового',
                r'последние\s*новости',
                r'news',
            ],
            'search': [
                r'найди\s+(.+)',
                r'поиск\s+(.+)',
                r'найти\s+(.+)',
                r'search\s+(.+)',
                r'google\s+(.+)',
            ],
            'reminder': [
                r'напомни\s+(.+)',
                r'поставь\s*напоминание\s+(.+)',
                r'remind\s+me\s+(.+)',
            ],
            'calendar': [
                r'добавь\s*в\s*календарь\s+(.+)',
                r'запланируй\s+(.+)',
                r'add\s*to\s*calendar\s+(.+)',
                r'schedule\s+(.+)',
            ],
            'email': [
                r'отправь\s*письмо\s+(.+)',
                r'напиши\s*email\s+(.+)',
                r'send\s*email\s+(.+)',
            ],
            'screenshot': [
                r'сделай\s*скриншот',
                r'сними\s*экран',
                r'screenshot',
                r'capture\s*screen',
            ],
            'camera': [
                r'что\s*на\s*камере',
                r'покажи\s*камеру',
                r'включи\s*камеру',
                r'show\s*camera',
                r'what.*camera',
            ],
            'help': [
                r'помощь',
                r'что\s*ты\s*умеешь',
                r'список\s*команд',
                r'help',
                r'what\s*can\s*you\s*do',
            ],
            'exit': [
                r'выход',
                r'закончить',
                r'до\s*свидания',
                r'пока',
                r'exit',
                r'quit',
                r'goodbye',
            ],
            'silence': [
                r'молчи',
                r'тихо',
                r'замолчи',
                r'be\s*quiet',
                r'shut\s*up',
            ],
        }
        
        # Словари синонимов
        self.synonyms = {
            'москва': ['москва', 'столица', 'мск'],
            'санкт-петербург': ['санкт-петербург', 'питер', 'спб', 'ленинград'],
        }
        
        log.info("NLP модуль инициализирован")
    
    def parse_command(self, text: str) -> Dict:
        """Разбор команды и определение намерения"""
        text_lower = text.lower().strip()
        
        result = {
            'intent': 'unknown',
            'confidence': 0.0,
            'entities': {},
            'original_text': text,
        }
        
        best_match = None
        best_confidence = 0.0
        
        # Поиск наилучшего совпадения
        for intent, patterns in self.command_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text_lower)
                if match:
                    confidence = len(match.group(0)) / len(text_lower)
                    
                    if confidence > best_confidence:
                        best_confidence = confidence
                        best_match = intent
                        
                        # Извлечение сущностей
                        if match.groups():
                            result['entities']['query'] = match.group(1) if match.lastindex >= 1 else None
        
        if best_match:
            result['intent'] = best_match
            result['confidence'] = min(best_confidence, 1.0)
            
            # Дополнительное извлечение сущностей
            self._extract_entities(result, text_lower)
        
        log.debug(f"Намерение: {result['intent']}, Уверенность: {result['confidence']:.2f}")
        
        return result
    
    def _extract_entities(self, result: Dict, text: str):
        """Извлечение сущностей из текста"""
        intent = result['intent']
        
        # Извлечение локации для погоды
        if intent == 'weather':
            location = self._extract_location(text)
            if location:
                result['entities']['location'] = location
        
        # Извлечение времени для напоминаний
        if intent in ['reminder', 'calendar']:
            time_info = self._extract_datetime(text)
            if time_info:
                result['entities']['datetime'] = time_info
        
        # Извлечение поискового запроса
        if intent == 'search':
            query_match = re.search(r'(найди|поиск|найти|search|google)\s+(.+)', text)
            if query_match:
                result['entities']['query'] = query_match.group(2).strip()
    
    def _extract_location(self, text: str) -> Optional[str]:
        """Извлечение названия города/локации"""
        # Простая эвристика - поиск после предлогов
        patterns = [
            r'погода\s*в\s+(\w+)',
            r'weather\s*in\s+(\w+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)
        
        # Проверка по синонимам
        for canonical, synonyms in self.synonyms.items():
            for synonym in synonyms:
                if synonym in text:
                    return canonical
        
        return None
    
    def _extract_datetime(self, text: str) -> Optional[Dict]:
        """Извлечение даты и времени из текста"""
        now = datetime.now()
        
        # Распознавание относительного времени
        time_info = {}
        
        if 'завтра' in text or 'tomorrow' in text:
            time_info['date'] = now.replace(day=now.day + 1)
        elif 'послезавтра' in text:
            time_info['date'] = now.replace(day=now.day + 2)
        elif 'сегодня' in text or 'today' in text:
            time_info['date'] = now
        
        # Распознавание времени
        time_pattern = r'(\d{1,2})[:\.](\d{2})'
        match = re.search(time_pattern, text)
        if match:
            time_info['hour'] = int(match.group(1))
            time_info['minute'] = int(match.group(2))
        
        # Распознавание дней недели (упрощенно)
        days_of_week = {
            'понедельник': 0, 'вторник': 1, 'среда': 2, 'четверг': 3,
            'пятница': 4, 'суббота': 5, 'воскресенье': 6,
            'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
            'friday': 4, 'saturday': 5, 'sunday': 6,
        }
        
        for day_name, day_num in days_of_week.items():
            if day_name in text:
                # Найти ближайший указанный день недели
                days_ahead = day_num - now.weekday()
                if days_ahead < 0:
                    days_ahead += 7
                time_info['date'] = now.replace(day=now.day + days_ahead)
                break
        
        return time_info if time_info else None
    
    def get_suggestions(self, partial_text: str) -> List[str]:
        """Предложение возможных команд по частичному вводу"""
        suggestions = []
        partial_lower = partial_text.lower()
        
        for intent, patterns in self.command_patterns.items():
            for pattern in patterns:
                # Упрощаем паттерн для сравнения
                clean_pattern = re.sub(r'[\\s\\*\\+\\?]', ' ', pattern)
                if clean_pattern.startswith(partial_lower):
                    suggestions.append(intent)
                    break
        
        return suggestions[:5]  # Возвращаем не более 5 подсказок
    
    def normalize_text(self, text: str) -> str:
        """Нормализация текста"""
        # Приведение к нижнему регистру
        text = text.lower()
        
        # Удаление лишних пробелов
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Замена разговорных форм
        replacements = {
            'скока': 'сколько',
            'щас': 'сейчас',
            'минут': 'минут',
            'чё': 'что',
            'че': 'что',
        }
        
        for short, full in replacements.items():
            text = text.replace(short, full)
        
        return text
    
    def is_greeting(self, text: str) -> bool:
        """Проверка, является ли текст приветствием"""
        result = self.parse_command(text)
        return result['intent'] == 'greeting'
    
    def is_exit_command(self, text: str) -> bool:
        """Проверка, является ли текст командой выхода"""
        result = self.parse_command(text)
        return result['intent'] == 'exit'
