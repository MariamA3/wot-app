import time
from flask import Flask, jsonify, render_template, request
from gpiozero.pins.pigpio import PiGPIOFactory
from gpiozero import Servo
import serial
from test import get_sensor_data 

# Initialize Flask app
app = Flask(__name__)

# Setup for servo
pin_factory = PiGPIOFactory()
servo = Servo(18, pin_factory=pin_factory)

# Initialize variables for servo activation state
servo_activated = False

# For connecting to the micro:bit
microbit_port = '/dev/ttyACM0'
baud_rate = 115200
try:
    ser = serial.Serial(microbit_port, baud_rate, timeout=1)
    print(f"Serial connection established: {ser.is_open}")
except serial.SerialException as e:
    print(f"Serial error: {e}")
    ser = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sensor-data", methods=["GET"])
def sensor_data():
    global servo_activated
    data = get_sensor_data()  # Fetch temperature and humidity data

    if data:
        temperature = data["temperature_c"]
        humidity = data["humidity"]

        # Check if humidity is lower than 50% and activate the servo and motor if not already activated
        if humidity < 89 and not servo_activated:
            # Activate servo
            print("Activating servo...")
            servo.min()  # Move to 90°
            time.sleep(1)  # Hold for 1 second
            servo.max()  # Move servo to 180°

            # Send command to micro:bit for motor
            if ser:
                print("Sending TOGGLE command to micro:bit for motor.")
                ser.write("TOGGLE\n".encode("utf-8"))
                ser.flush()
                print("TOGGLE command sent!")

            # Set activation flag
            servo_activated = True

        # Check if humidity goes above 50%
        elif humidity >= 50 and servo_activated:
            # Reset the servo and stop motor (if needed)
            print("Humidity above 50%, resetting servo position...")
            servo.min()  # Move back to 90° (or stop servo at default position)
            time.sleep(1)  # Hold for 1 second
            servo.max()  # Move servo to 180° (can be adjusted as needed)
            time.sleep(6)

            # Reset activation flag
            servo_activated = False

        # Return sensor data and servo activation status
        return jsonify({
            "temperature": temperature,
            "humidity": humidity,
            "servo_activated": servo_activated
        })
    else:
        return jsonify({
            "error": "Failed to read sensor data"
        }), 500

# Initialize Flask app
app = Flask(__name__)

# Motor state
motor_running = False

@app.route("/toggle-motor", methods=["POST"])
def toggle_motor():
    global motor_running
    data = request.json  # Expecting {"action": "start"} or {"action": "stop"}
    
    if data["action"] == "start":
        # Start motor
        motor_running = True
        if ser:
            ser.write("MOTOR_START\n".encode("utf-8"))
            ser.flush()
        return jsonify({"motor_running": motor_running})
    
    elif data["action"] == "stop":
        # Stop motor
        motor_running = False
        if ser:
            ser.write("MOTOR_STOP\n".encode("utf-8"))
            ser.flush()
        return jsonify({"motor_running": motor_running})
    
    return jsonify({"error": "Invalid action"}), 400
