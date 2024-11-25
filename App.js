import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); 

const SmartHumidifier = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Smart Humidifier</Text>
        <View style={styles.statusContainer}>
          
          <Text style={styles.statusText}>Humidity level: 70%</Text>
          <Text style={styles.statusText}>Temperature: 30°C / 86°F</Text>
        </View>
        <Text style={styles.sectionTitle}>Humidity Controls</Text>
        <View style={styles.controlsContainer}>
          <HumidityControl label="Minimum" value="60%" />
          <HumidityControl label="Maximum" value="90%" />
        </View>
        <Text style={styles.note}>
          *Ensure that you set the recommended humidity for your environment.
        </Text>
        <Text style={styles.sectionTitle}>Fan Control</Text>
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
          <TouchableOpacity>
            <Text style={styles.arrow}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity>
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
    backgroundColor: '#1E1E1E',
  },
  container: {
    flex: 1,
    borderRadius: 30,
    marginHorizontal: width * 0.05, 
    padding: width * 0.06, 
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1.8,
    textAlign: 'center',
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 1.2,
    marginVertical: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '500',
    letterSpacing: 1.6,
    marginTop: 50,
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  note: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  controlContainer: {
    alignItems: 'center',
    width: '40%', 
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
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
   
  },
  controlValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  arrowContainer: {
    marginTop: 10,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});

export default SmartHumidifier;
