#!/usr/bin/env python3
"""
JARVIS AI - Продвинутый Искусственный Интеллект
Точка входа в приложение
"""
import sys
import argparse

from utils.logger import log
from core.assistant import JarvisAssistant
from config.settings import DEBUG_MODE


def main():
    """Основная функция запуска"""
    
    # Парсинг аргументов командной строки
    parser = argparse.ArgumentParser(
        description='JARVIS AI - Персональный голосовой ассистент',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Примеры использования:
  python main.py                    # Запуск с голосовой активацией
  python main.py --no-activation    # Запуск без ключевого слова
  python main.py --text-mode        # Текстовый режим (без голоса)
  python main.py --user "Иван"      # Установить имя пользователя
        """
    )
    
    parser.add_argument(
        '--no-activation',
        action='store_true',
        help='Запуск без ожидания ключевого слова'
    )
    
    parser.add_argument(
        '--text-mode',
        action='store_true',
        help='Текстовый режим работы (без голоса)'
    )
    
    parser.add_argument(
        '--user',
        type=str,
        default=None,
        help='Имя пользователя'
    )
    
    parser.add_argument(
        '--test-mic',
        action='store_true',
        help='Тестирование микрофона и выход'
    )
    
    parser.add_argument(
        '--list-mics',
        action='store_true',
        help='Список доступных микрофонов'
    )
    
    args = parser.parse_args()
    
    # Логирование запуска
    log.info("=" * 50)
    log.info("JARVIS AI запускается...")
    log.info(f"Режим отладки: {DEBUG_MODE}")
    log.info("=" * 50)
    
    try:
        # Создание ассистента
        jarvis = JarvisAssistant()
        
        # Установка имени пользователя если указано
        if args.user:
            jarvis.set_user_name(args.user)
        
        # Тестирование микрофона
        if args.test_mic:
            log.info("Тестирование микрофона...")
            success = jarvis.voice_recognition.test_microphone()
            if success:
                print("✓ Микрофон работает корректно")
            else:
                print("✗ Микрофон не работает или не настроен")
            return
        
        # Список микрофонов
        if args.list_mics:
            log.info("Доступные микрофоны:")
            mics = jarvis.voice_recognition.list_microphones()
            for mic in mics:
                print(f"  [{mic['index']}] {mic['name']}")
            return
        
        # Текстовый режим
        if args.text_mode:
            log.info("Запуск в текстовом режиме...")
            run_text_mode(jarvis)
        else:
            # Голосовой режим
            use_activation = not args.no_activation
            log.info(f"Запуск в голосовом режиме (активация: {use_activation})...")
            jarvis.start(use_voice_activation=use_activation)
    
    except KeyboardInterrupt:
        log.info("\nПолучен сигнал прерывания (Ctrl+C)")
        print("\nДо свидания!")
    except Exception as e:
        log.error(f"Критическая ошибка: {e}", exc_info=True)
        print(f"\nПроизошла ошибка: {e}")
        if DEBUG_MODE:
            import traceback
            traceback.print_exc()
        sys.exit(1)


def run_text_mode(jarvis: JarvisAssistant):
    """Запуск в текстовом режиме (консольный ввод/вывод)"""
    print("\n" + "=" * 50)
    print("JARVIS AI - Текстовый режим")
    print("=" * 50)
    print(f"{jarvis.user_name}, введите команду (или 'помощь' для списка команд)")
    print("Для выхода введите 'выход' или 'пока'")
    print("=" * 50 + "\n")
    
    while True:
        try:
            # Ввод команды
            command = input("Вы: ").strip()
            
            if not command:
                continue
            
            # Проверка на выход
            if command.lower() in ['выход', 'пока', 'exit', 'quit', 'до свидания']:
                print("JARVIS: До свидания! Было приятно помочь.")
                break
            
            # Обработка команды
            jarvis.process_command(command)
            
        except KeyboardInterrupt:
            print("\n\nДо свидания!")
            break
        except EOFError:
            break


if __name__ == "__main__":
    main()
