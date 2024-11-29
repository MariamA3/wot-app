import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

const SmartHumidifier = () => {
  const [humidity, setHumidity] = useState(70);
  const [temperature, setTemperature] = useState(30);
  const [servoActivated, setServoActivated] = useState(false);
  const [humidityThreshold, setHumidityThreshold] = useState(50);
  const [manualServoActivated, setManualServoActivated] = useState(false);

  //Husk å endre ip adresse hver ny forsøk.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://10.22.85.174:5000/sensor-data");
        const data = await response.json();
        if (response.ok) {
          setHumidity(data.humidity);
          setTemperature(data.temperature);
          setServoActivated(data.servo_activated);
        } else {
          console.error("Error fetching sensor data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching data from Flask API:", error);
      }
    };

    fetchData();
  }, []);

  const updateThreshold = async (newThreshold) => {
    try {
      const response = await fetch("http://10.22.84.78:5000/update-threshold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threshold: newThreshold }),
      });

      const data = await response.json();
      if (response.ok) {
        setHumidityThreshold(data.threshold);
      } else {
        console.error("Error updating threshold:", data.error);
      }
    } catch (error) {
      console.error("Error updating threshold:", error);
    }
  };

  const toggleMotor = async () => {
    try {
      const response = await fetch("http://10.22.85.174:5000/toggle-motor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setManualServoActivated(data.servo_activated);
      } else {
        console.error("Error toggling motor:", data.error);
      }
    } catch (error) {
      console.error("Error sending motor toggle request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Smart Humidifier</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Humidity: {humidity}%</Text>
          <Text style={styles.statusText}>
            Temp: {temperature}°C / {((temperature * 9) / 5 + 32).toFixed(1)}°F
          </Text>
          <Text style={styles.statusText}>
            Servo {servoActivated ? "Activated" : "Deactivated"}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Set Humidity Threshold</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.thresholdLabel}>
            Threshold: {humidityThreshold}%
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={humidityThreshold}
            onValueChange={(value) => {
              setHumidityThreshold(value);
              updateThreshold(value);
            }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={toggleMotor}>
          <Text style={styles.buttonText}>
            {manualServoActivated ? "Turn Off Motor" : "Turn On Motor"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.note}>
          * Set recommended humidity for your environment.
        </Text>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  container: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: width * 0.05,
    padding: width * 0.06,
    alignItems: "flex-start", 
    backgroundColor: "#1C1C1C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "600",
    letterSpacing: 2,
    textAlign: "left",
    marginBottom: 20,
  },
  statusContainer: {
    marginTop: 10,
  },
  statusText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "400",
    marginVertical: 5,
    textAlign: "left", 
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 30,
    letterSpacing: 1.5,
    textAlign: "left", 
  },
  sliderContainer: {
    width: "80%",
    marginTop: 20,
  },
  thresholdLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  note: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 15,
    textAlign: "left", 
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  
});

export default SmartHumidifier;
