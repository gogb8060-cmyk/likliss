# Инструкция по установке JARVIS AI

## Требования

- Python 3.9 или выше
- Микрофон (для голосового режима)
- Динамики/наушники (для озвучивания)
- Операционная система: Linux, macOS или Windows

## Шаг 1: Клонирование репозитория

```bash
cd /workspace
# Если вы еще не клонировали проект
# git clone <repository-url> jarvis_ai
```

## Шаг 2: Создание виртуального окружения

### Linux/macOS:
```bash
cd jarvis_ai
python3 -m venv venv
source venv/bin/activate
```

### Windows:
```bash
cd jarvis_ai
python -m venv venv
venv\Scripts\activate
```

## Шаг 3: Установка системных зависимостей

### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y \
    python3-pyaudio \
    portaudio19-dev \
    espeak \
    libespeak-dev \
    ffmpeg \
    libopencv-dev
```

### macOS:
```bash
brew install portaudio \
    espeak \
    ffmpeg \
    opencv
```

### Windows:
- Установите [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- PyAudio установится автоматически через pip

## Шаг 4: Установка Python зависимостей

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Для расширенных функций (опционально):

```bash
# OpenAI GPT интеграция
pip install openai

# Google Cloud Speech-to-Text
pip install google-cloud-speech

# Продвинутый синтез речи
pip install elevenlabs

# Wolfram Alpha для вычислений
pip install wolframalpha
```

## Шаг 5: Настройка конфигурации

### 5.1 Скопируйте пример файла с API ключами:

```bash
cp config/api_keys.json.example config/api_keys.json
```

### 5.2 Отредактируйте `config/api_keys.json`:

Получите API ключи и вставьте их в файл:

- **OpenAI API Key**: https://platform.openai.com/api-keys
- **Google API Key**: https://console.cloud.google.com/apis/credentials
- **Weather API**: https://openweathermap.org/api
- **News API**: https://newsapi.org/
- **Wolfram Alpha**: https://products.wolframalpha.com/api/

Или используйте переменные окружения:

```bash
export OPENAI_API_KEY="your-key-here"
export GOOGLE_API_KEY="your-key-here"
export WEATHER_API_KEY="your-key-here"
export NEWS_API_KEY="your-key-here"
```

## Шаг 6: Первый запуск

### Тестирование микрофона:

```bash
python main.py --list-mics    # Показать доступные микрофоны
python main.py --test-mic     # Протестировать микрофон
```

### Запуск в текстовом режиме (рекомендуется для первого запуска):

```bash
python main.py --text-mode --user "ВашеИмя"
```

Примеры команд в текстовом режиме:
- "Привет, Джарвис"
- "Который час?"
- "Какое сегодня число?"
- "Помощь"
- "Выход"

### Запуск в голосовом режиме:

```bash
# С ожиданием ключевого слова "Джарвис"
python main.py --user "ВашеИмя"

# Без ожидания ключевого слова (непрерывный режим)
python main.py --no-activation --user "ВашеИмя"
```

## Шаг 7: Проверка работы

После запуска попробуйте следующие команды:

**Голосом или текстом:**
1. "Привет, Джарвис" - приветствие
2. "Который час?" - узнать время
3. "Какое сегодня число?" - узнать дату
4. "Помощь" - список возможностей
5. "Найди информацию о квантовых компьютерах" - поиск
6. "Выход" - завершение работы

## Решение проблем

### Проблема: Microphone не работает

**Linux:**
```bash
# Проверка прав доступа
sudo usermod -aG audio $USER
# Перезайдите в систему
```

**Windows:**
- Убедитесь, что микрофон разрешен в настройках конфиденциальности
- Проверьте настройки звука в Панели управления

### Проблема: Ошибка при установке PyAudio

**Linux:**
```bash
sudo apt-get install python3-pyaudio portaudio19-dev
```

**macOS:**
```bash
brew install portaudio
```

**Windows:**
```bash
pip install pipwin
pipwin install pyaudio
```

### Проблема: Синтез речи не работает

Установите eSpeak:

**Linux:**
```bash
sudo apt-get install espeak espeak-data libespeak-dev
```

**macOS:**
```bash
brew install espeak
```

**Windows:**
- Скачайте с http://espeak.sourceforge.net/

### Проблема: Распознавание речи не работает

Проверьте подключение к интернету (Google Speech Recognition требует сеть).

Для оффлайн-распознавания убедитесь, что установлен pocketsphinx:

```bash
pip install pocketsphinx
```

## Дополнительные возможности

### Использование различных языков

Измените в `config/settings.py`:

```python
VOICE_LANGUAGE = "en-US"  # Английский
# или
VOICE_LANGUAGE = "ru-RU"  # Русский
# или
VOICE_LANGUAGE = "de-DE"  # Немецкий
```

### Изменение голоса

Для выбора другого голоса отредактируйте в `config/settings.py`:

```python
TTS_VOICE_GENDER = "female"  # или "male"
```

### Настройка скорости речи

```python
TTS_RATE = 150  # Слов в минуту (обычно 100-200)
```

## Следующие шаги

После базовой настройки вы можете:

1. Добавить новые модули в папку `modules/`
2. Настроить интеграцию с умным домом
3. Добавить поддержку дополнительных API
4. Расширить NLP модель для лучшего понимания команд
5. Настроить машинное обучение для адаптации под пользователя

## Поддержка

При возникновении проблем:
1. Проверьте логи в `data/jarvis.log`
2. Включите режим отладки: `export DEBUG_MODE=True`
3. Создайте issue на GitHub с описанием проблемы

---

**Удачи в использовании JARVIS AI!** 🚀
