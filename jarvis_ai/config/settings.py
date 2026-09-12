"""
Конфигурация JARVIS AI
"""
import os
from pathlib import Path

# Базовая директория проекта
BASE_DIR = Path(__file__).resolve().parent.parent

# Логирование
LOG_LEVEL = "INFO"
LOG_FILE = BASE_DIR / "data" / "jarvis.log"
LOG_FORMAT = "{time:YYYY-MM-DD HH:mm:ss} | {level} | {module}:{function}:{line} - {message}"

# Голосовые настройки
VOICE_LANGUAGE = "ru-RU"  # Основной язык
VOICE_ACTIVATION_KEYWORD = "джарвис"  # Слово активации
SPEECH_RECOGNITION_TIMEOUT = 5  # секунды
SPEECH_RECOGNITION_PHRASE_TIME_LIMIT = 10  # секунды

# Настройки синтеза речи
TTS_ENGINE = "pyttsx3"  # pyttsx3 или gtts
TTS_RATE = 150  # Скорость речи
TTS_VOLUME = 0.9  # Громкость (0.0 - 1.0)
TTS_VOICE_GENDER = "male"  # male или female

# API Ключи (загрузить из api_keys.json или .env)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
WOLFRAM_ALPHA_APPID = os.getenv("WOLFRAM_ALPHA_APPID", "")

# База данных
DATABASE_URL = f"sqlite:///{BASE_DIR}/data/jarvis.db"

# Redis (кэширование)
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = 0

# Компьютерное зрение
CAMERA_INDEX = 0  # Индекс камеры
FACE_DETECTION_MODEL = "haarcascade_frontalface_default.xml"
OBJECT_DETECTION_CONFIDENCE = 0.5

# Автоматизация
SCREENSHOT_DIR = BASE_DIR / "data" / "screenshots"
DOWNLOAD_DIR = BASE_DIR / "data" / "downloads"

# Память
MEMORY_MAX_ENTRIES = 1000  # Максимальное количество записей в памяти
MEMORY_EXPIRY_HOURS = 24 * 30  # Срок хранения памяти (30 дней)

# Обучение
LEARNING_ENABLED = True
LEARNING_RATE = 0.001
MODEL_SAVE_DIR = BASE_DIR / "data" / "models"

# Безопасность
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "")
AUTH_REQUIRED_FOR_SENSITIVE_COMMANDS = True

# Производительность
MAX_WORKERS = 4
USE_GPU = True  # Использовать GPU для ML задач

# Отладка
DEBUG_MODE = os.getenv("DEBUG_MODE", "False").lower() == "true"
