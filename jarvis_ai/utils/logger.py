"""
Система логирования JARVIS AI
"""
from loguru import logger
import sys
from pathlib import Path

from config.settings import LOG_FILE, LOG_FORMAT, LOG_LEVEL, DEBUG_MODE


def setup_logger():
    """Настройка системы логирования"""
    
    # Удаляем стандартный обработчик
    logger.remove()
    
    # Консольный вывод
    logger.add(
        sys.stdout,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{module}:{function}:{line}</cyan> - <level>{message}</level>",
        level=LOG_LEVEL,
        colorize=True
    )
    
    # Файловый вывод
    logger.add(
        LOG_FILE,
        format=LOG_FORMAT,
        level=LOG_LEVEL,
        rotation="10 MB",
        retention="7 days",
        compression="zip",
        backtrace=True,
        diagnose=DEBUG_MODE
    )
    
    logger.info("Система логирования инициализирована")
    
    return logger


# Создаем глобальный экземпляр логгера
log = setup_logger()
