# 🚀 Быстрый старт JARVIS AI

## Структура проекта

```
jarvis_ai/
├── core/                    # Ядро системы
│   ├── assistant.py         # Главный класс ассистента
│   └── memory.py            # Система памяти
├── modules/                 # Модули
│   ├── voice_recognition.py # Распознавание речи
│   ├── speech_synthesis.py  # Синтез речи
│   └── natural_language.py  # NLP обработка
├── utils/                   # Утилиты
│   └── logger.py            # Логирование
├── config/                  # Конфигурация
│   ├── settings.py          # Настройки
│   └── api_keys.json.example # Пример API ключей
├── data/                    # Данные (БД, логи)
├── main.py                  # Точка входа
├── requirements.txt         # Зависимости Python
├── README.md                # Полная документация
├── INSTALL.md               # Инструкция по установке
└── .gitignore              # Git исключения
```

## Установка за 5 минут

### 1. Установка зависимостей
```bash
cd /workspace/jarvis_ai
python -m venv venv
source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```

### 2. Запуск в текстовом режиме (без микрофона)
```bash
python main.py --text-mode --user "ВашеИмя"
```

### 3. Примеры команд
- `Привет` - приветствие
- `Который час?` - время
- `Какое сегодня число?` - дата
- `Помощь` - список команд
- `Найди информацию о Python` - поиск
- `Выход` - завершение работы

## Режимы запуска

| Команда | Описание |
|---------|----------|
| `python main.py --text-mode` | Текстовый режим (консоль) |
| `python main.py` | Голосовой режим с активацией по слову "Джарвис" |
| `python main.py --no-activation` | Непрерывный голосовой режим |
| `python main.py --test-mic` | Тест микрофона |
| `python main.py --list-mics` | Список микрофонов |
| `python main.py --user "Имя"` | Установить имя пользователя |

## Архитектура

```
┌─────────────────────────────────────────────────┐
│              Пользователь                        │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────▼─────────────┐
    │     JarvisAssistant       │  ← Главный координатор
    └─────────────┬─────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐   ┌────▼────┐   ┌────▼────┐
│ Voice │   │  NLP    │   │ Speech  │
│ Recog │   │Processor│   │Synthesis│
└───┬───┘   └────┬────┘   └────┬────┘
    │            │             │
    │       ┌────▼────┐        │
    └──────►│ Memory  │◄───────┘
            │ System  │
            └─────────┘
```

## Компоненты

### 🔹 Core (Ядро)
- **JarvisAssistant**: Координация всех модулей, обработка команд
- **Memory**: Кратковременная и долговременная память (SQLite)

### 🔹 Modules (Модули)
- **VoiceRecognition**: Распознавание речи (Google Speech, Sphinx)
- **SpeechSynthesis**: Синтез речи (pyttsx3, gTTS)
- **NaturalLanguageProcessor**: Понимание команд, извлечение намерений

### 🔹 Utils (Утилиты)
- **Logger**: Логирование с использованием loguru

## Расширение функциональности

### Добавление новой команды

1. Откройте `modules/natural_language.py`
2. Добавьте паттерн в `command_patterns`:
```python
'my_command': [
    r'моя\s+команда\s+(.+)',
],
```

3. Откройте `core/assistant.py`
4. Добавьте обработчик в `_handle_intent`:
```python
'my_command': self._handle_my_command,
```

5. Создайте метод обработки:
```python
def _handle_my_command(self, entities: Dict, command: str) -> str:
    data = entities.get('query', '')
    return f"Обрабатываю: {data}"
```

## Следующие шаги развития

### Этап 1 (Готово ✅)
- [x] Базовая архитектура
- [x] Распознавание речи
- [x] Синтез речи
- [x] NLP обработка команд
- [x] Система памяти
- [x] Текстовый интерфейс

### Этап 2 (В разработке 🚧)
- [ ] Интеграция с Weather API
- [ ] Интеграция с News API
- [ ] Поиск в Google
- [ ] Система напоминаний
- [ ] Управление календарем

### Этап 3 (Планируется 📋)
- [ ] Компьютерное зрение (OpenCV)
- [ ] Автоматизация задач
- [ ] Умный дом интеграция
- [ ] Email клиент
- [ ] Машинное обучение

## Решение проблем

### pyttsx3 не работает
```bash
# Linux
sudo apt-get install espeak espeak-data libespeak-dev

# macOS
brew install espeak

# Windows
# Скачайте eSpeak с http://espeak.sourceforge.net/
```

### Микрофон не работает
```bash
# Linux - проверка прав
sudo usermod -aG audio $USER
# Перезайдите в систему
```

### Ошибки распознавания
- Проверьте подключение к интернету (Google Speech требует сеть)
- Для оффлайн-режима: `pip install pocketsphinx`

## Логи

Все логи сохраняются в `data/jarvis.log`

Для включения режима отладки:
```bash
export DEBUG_MODE=True
python main.py --text-mode
```

## API Ключи (опционально)

Для расширенных функций получите ключи:
- OpenAI: https://platform.openai.com/api-keys
- Weather: https://openweathermap.org/api
- News: https://newsapi.org/

Скопируйте `config/api_keys.json.example` в `config/api_keys.json` и вставьте ключи.

---

**JARVIS AI готов к использованию!** 🎉

Для начала работы выполните:
```bash
cd /workspace/jarvis_ai
python main.py --text-mode --user "Тони"
```
