"""
Система памяти JARVIS AI
Хранение контекста диалогов и пользовательских данных
"""
import sqlite3
import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pathlib import Path

from config.settings import DATABASE_URL, MEMORY_MAX_ENTRIES, MEMORY_EXPIRY_HOURS
from utils.logger import log


class Memory:
    """Система долговременной и кратковременной памяти"""
    
    def __init__(self, db_url: str = DATABASE_URL):
        self.db_url = db_url
        self.short_term_memory: List[Dict] = []  # Кратковременная память
        self.context_window_size = 10  # Количество последних сообщений в контексте
        
        # Инициализация базы данных
        self._init_database()
        log.info("Система памяти инициализирована")
    
    def _init_database(self):
        """Инициализация базы данных"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        cursor = conn.cursor()
        
        # Таблица долговременной памяти
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS long_term_memory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                category TEXT,
                content TEXT,
                metadata TEXT,
                importance REAL DEFAULT 0.5
            )
        ''')
        
        # Таблица пользовательских предпочтений
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE,
                value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Таблица истории диалогов
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_input TEXT,
                assistant_response TEXT,
                context TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
        log.debug("База данных памяти инициализирована")
    
    def add_to_short_term(self, entry: Dict[str, Any]):
        """Добавление в кратковременную память"""
        entry['timestamp'] = datetime.now()
        self.short_term_memory.append(entry)
        
        # Ограничиваем размер
        if len(self.short_term_memory) > self.context_window_size:
            self.short_term_memory.pop(0)
        
        log.debug(f"Добавлено в кратковременную память: {entry.get('type', 'unknown')}")
    
    def get_short_term(self, limit: int = None) -> List[Dict]:
        """Получение из кратковременной памяти"""
        if limit:
            return self.short_term_memory[-limit:]
        return self.short_term_memory.copy()
    
    def clear_short_term(self):
        """Очистка кратковременной памяти"""
        self.short_term_memory.clear()
        log.debug("Кратковременная память очищена")
    
    def add_to_long_term(self, category: str, content: str, 
                         metadata: Optional[Dict] = None, 
                         importance: float = 0.5):
        """Добавление в долговременную память"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO long_term_memory (category, content, metadata, importance)
            VALUES (?, ?, ?, ?)
        ''', (category, content, json.dumps(metadata or {}), importance))
        
        conn.commit()
        conn.close()
        
        # Очистка старой памяти
        self._cleanup_old_memories()
        
        log.info(f"Добавлено в долговременную память: {category}")
    
    def get_from_long_term(self, category: Optional[str] = None, 
                           limit: int = 50) -> List[Dict]:
        """Получение из долговременной памяти"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if category:
            cursor.execute('''
                SELECT * FROM long_term_memory 
                WHERE category = ? 
                ORDER BY importance DESC, timestamp DESC 
                LIMIT ?
            ''', (category, limit))
        else:
            cursor.execute('''
                SELECT * FROM long_term_memory 
                ORDER BY importance DESC, timestamp DESC 
                LIMIT ?
            ''', (limit,))
        
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return results
    
    def save_conversation(self, user_input: str, assistant_response: str, 
                          context: Optional[Dict] = None):
        """Сохранение диалога"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO conversation_history (user_input, assistant_response, context)
            VALUES (?, ?, ?)
        ''', (user_input, assistant_response, json.dumps(context or {})))
        
        conn.commit()
        conn.close()
        
        log.debug("Диалог сохранен")
    
    def get_recent_conversations(self, limit: int = 20) -> List[Dict]:
        """Получение недавних диалогов"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM conversation_history 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return results
    
    def set_preference(self, key: str, value: Any):
        """Установка пользовательского предпочтения"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO user_preferences (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        ''', (key, json.dumps(value)))
        
        conn.commit()
        conn.close()
        
        log.info(f"Установлено предпочтение: {key}")
    
    def get_preference(self, key: str, default: Any = None) -> Any:
        """Получение пользовательского предпочтения"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        cursor = conn.cursor()
        
        cursor.execute('SELECT value FROM user_preferences WHERE key = ?', (key,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return json.loads(result[0])
        return default
    
    def _cleanup_old_memories(self):
        """Очистка старой памяти"""
        conn = sqlite3.connect(self.db_url.replace("sqlite:///", ""))
        cursor = conn.cursor()
        
        expiry_date = datetime.now() - timedelta(hours=MEMORY_EXPIRY_HOURS)
        
        # Удаляем старые записи с низкой важностью
        cursor.execute('''
            DELETE FROM long_term_memory 
            WHERE timestamp < ? AND importance < 0.7
        ''', (expiry_date,))
        
        deleted = cursor.rowcount
        conn.commit()
        conn.close()
        
        if deleted > 0:
            log.info(f"Очищено {deleted} старых записей памяти")
    
    def search_memory(self, query: str, category: Optional[str] = None) -> List[Dict]:
        """Поиск в памяти по ключевым словам"""
        memories = self.get_from_long_term(category=category, limit=MEMORY_MAX_ENTRIES)
        
        results = []
        query_lower = query.lower()
        
        for memory in memories:
            content = memory.get('content', '').lower()
            if query_lower in content:
                results.append(memory)
        
        return results
    
    def get_context(self) -> str:
        """Получение текущего контекста для NLP"""
        context_parts = []
        
        # Добавляем последние диалоги
        recent = self.get_short_term(limit=self.context_window_size)
        for entry in recent:
            if entry.get('type') == 'conversation':
                context_parts.append(f"User: {entry.get('user_input')}")
                context_parts.append(f"Assistant: {entry.get('assistant_response')}")
        
        return "\n".join(context_parts)
