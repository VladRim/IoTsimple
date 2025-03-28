# IoTsimple
Это классический IoT-проект на Raspberry Pi.

Следующий стек технологий:

    Локальный dashboard: Node.js + React (или Grafana для быстрой визуализации)
    MQTT-клиент: Eclipse Paho MQTT (или mosquitto как брокер)
    База данных: SQLite
    Modbus: pymodbus (Python-библиотека для работы с Modbus RTU/TCP)
    Backend: FastAPI или Flask для API и обработки данных

1. Подключение Modbus RTU (RS-485)
    Если датчики используют RS-485, потребуется USB-RS485 адаптер.
    Подключение адаптера
        A (D+) адаптера → A (D+) датчика
        B (D-) адаптера → B (D-) датчика
        GND адаптера → GND датчика (по необходимости)
    Проверить, что адаптер подключен:
    ls /dev/ttyUSB*
    
    Обычно он отображается как /dev/ttyUSB0 или /dev/ttyAMA0.

2. Установка pymodbus и чтение данных
Установим Python-библиотеку для работы с Modbus:
  pip install pymodbus

Пример чтения температуры с датчика по Modbus RTU:

from pymodbus.client import ModbusSerialClient

# Настраиваем соединение
client = ModbusSerialClient(
    method='rtu',
    port='/dev/ttyUSB0',  # Укажите свой порт
    baudrate=9600,
    timeout=1,
    parity='N',
    stopbits=1,
    bytesize=8
)

if client.connect():
    # Читаем регистр 0 (адрес устройства 1)
    response = client.read_holding_registers(0, 1, slave=1)
    if response.isError():
        print("Ошибка чтения")
    else:
        temperature = response.registers[0] / 10.0  # Пример обработки данных
        print(f"Температура: {temperature} °C")
    client.close()
else:
    print("Ошибка подключения к Modbus устройству")

3. Вариант подключения Modbus через GPIO через UART + RS-485 трансивер
    Можно использовать GPIO UART (TX/RX) + чип MAX485 или SP3485.
    Требуется программное управление DE/RE для переключения между приёмом и передачей.

Подключение через GPIO и MAX485
Схема подключения

MAX485	Raspberry Pi GPIO
RO (Receive Out)	GPIO 15 (RXD)
DI (Data In)	GPIO 14 (TXD)
DE (Driver Enable)	GPIO 18 (можно другой)
RE (Receiver Enable)	GPIO 18 (тот же, что и DE)
A	A (D+) датчика
B	B (D-) датчика
VCC	3.3V или 5V (зависит от модуля)
GND	GND

🔹 DE/RE объединены и управляются одним пином (GPIO 18)
🔹 UART RX/TX на GPIO 14/15 (стандартный последовательный порт)

4. Настройка Raspberry Pi

Выключаем UART (отключаем консоль на /dev/serial0)
sudo raspi-config
    Перейти в Interface Options -> Serial
    Would you like a login shell to be accessible over serial? → Нет
    Would you like the serial port hardware to be enabled? → Да

Перезагружаем Pi
    sudo reboot

Чтение данных с датчиков
Пример кода на Python + pymodbus:

from pymodbus.client import ModbusSerialClient
import RPi.GPIO as GPIO
import time

# Настройка GPIO
DE_RE_PIN = 18  # Управление направлением передачи
GPIO.setmode(GPIO.BCM)
GPIO.setup(DE_RE_PIN, GPIO.OUT)

# Настроим Modbus RTU
client = ModbusSerialClient(
    method='rtu',
    port='/dev/serial0',  # Используем GPIO UART
    baudrate=9600,
    parity='N',
    stopbits=1,
    bytesize=8,
    timeout=1
)

def read_temperature(sensor_id):
    GPIO.output(DE_RE_PIN, 1)  # Переключаем на передачу
    time.sleep(0.01)
    response = client.read_holding_registers(0, 1, slave=sensor_id)
    GPIO.output(DE_RE_PIN, 0)  # Переключаем на приём
    time.sleep(0.01)
    if response.isError():
        print(f"Ошибка чтения с датчика {sensor_id}")
    else:
        temperature = response.registers[0] / 10.0
        print(f"Датчик {sensor_id}: {temperature} °C")

# Читаем данные с 8 датчиков
if client.connect():
    for sensor in range(1, 9):
        read_temperature(sensor)
    client.close()
else:
    print("Ошибка подключения к Modbus устройствам")

GPIO.cleanup()

5. Настройка Mosquitto MQTT-брокера
Установи Mosquitto (если он еще не установлен):

sudo apt update
sudo apt install mosquitto mosquitto-clients

Запусти брокер:

sudo systemctl enable mosquitto
sudo systemctl start mosquitto

Проверь, работает ли Mosquitto:

mosquitto -v

Проверь подписку и публикацию сообщений: В одном терминале запусти подписку:

mosquitto_sub -h localhost -t "test/topic"

В другом терминале отправь сообщение:

mosquitto_pub -h localhost -t "test/topic" -m "Hello, MQTT!"
