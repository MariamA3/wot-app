import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); 

const SmartHumidifier = () => {
  const [humidity, setHumidity] = useState(70); 
  const [temperature, setTemperature] = useState(30);
  const [fanOn, setFanOn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetching data
      setHumidity(75);
      setTemperature(28);
    };

    fetchData();
  }, []);

  const toggleFan = () => {
    setFanOn(prevState => !prevState); // Toggle the fan state
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Smart Humidifier</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Humidity: {humidity}%</Text>
          <Text style={styles.statusText}>Temp: {temperature}°C / {(temperature * 9/5 + 32).toFixed(1)}°F</Text>
        </View>
        <Text style={styles.sectionTitle}>Humidity Controls</Text>
        <View style={styles.controlsContainer}>
          <HumidityControl label="Min" value="60%" />
          <HumidityControl label="Max" value="90%" />
        </View>
        <Text style={styles.note}>* Set recommended humidity for your environment.</Text>
        
        {/* Fan Control Button */}
        <TouchableOpacity style={[styles.fanButton, fanOn ? styles.fanOn : styles.fanOff]} onPress={toggleFan}>
          <Text style={styles.fanButtonText}>{fanOn ? 'Fan: On' : 'Fan: Off'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const HumidityControl = ({ label, value }) => {
  return (
    <View style={styles.controlContainer}>
      <Text style={styles.controlLabel}>{label}</Text>
      <View style={styles.controlBox}>
        <Text style={styles.controlValue}>{value}</Text>
        <View style={styles.arrowContainer}>
          <TouchableOpacity style={styles.arrowButton}>
            <Text style={styles.arrow}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowButton}>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  container: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: width * 0.05,
    padding: width * 0.06,
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
    marginVertical: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 50,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  note: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  controlContainer: {
    alignItems: 'center',
    width: '45%', 
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  controlBox: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#282828',
  },
  controlValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  arrowContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  arrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#444444',
    marginHorizontal: 4,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  // Fan Control Button Styles
  fanButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  fanOn: {
    backgroundColor: '#4CAF50',
  },
  fanOff: {
    backgroundColor: '#F44336',
  },
  fanButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default SmartHumidifier;
