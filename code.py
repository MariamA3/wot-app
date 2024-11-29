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

@app.route("/toggle-motor", methods=["POST"])
def toggle_motor():
    global servo_activated
    if ser:
        # Toggle motor using the micro:bit
        try:
            print("Manual motor toggle requested...")
            ser.write("TOGGLE\n".encode("utf-8"))
            ser.flush()
            servo_activated = not servo_activated  # Toggle the activation state
            print(f"Motor {'activated' if servo_activated else 'deactivated'}")
            return jsonify({"servo_activated": servo_activated})
        except Exception as e:
            print(f"Error toggling motor: {e}")
            return jsonify({"error": "Failed to toggle motor"}), 500
    else:
        return jsonify({"error": "Micro:bit not connected"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
