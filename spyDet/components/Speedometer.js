
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Magnetometer } from 'expo-sensors';
// import { Audio } from 'expo-av';
// import { PermissionsAndroid } from 'react-native';
// import WifiPermission from './components/wifiPermission';
// import WifiList from './components/getWifiDetail';

const Speedometer = ({ value }) => {
  const rotation = new Animated.Value(-90);

  useEffect(() => {
    // Calculate angle based on value (assuming max value is 100)
    const angle = (value / 100) * 180;

    // Animate the rotation of the needle
    Animated.timing(rotation, {
      toValue: angle,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <View style={styles.speedometer}>
      <Animated.View
        style={[
          styles.needle,
          {
            transform: [{ rotate: rotation.interpolate({
              inputRange: [0, 180],
              outputRange: ['0deg', '180deg'],
              
            }) }],
          },
        ]}
      />
      <Text style={styles.value}>{value.toFixed(2)} μT</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  speedometer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  needle: {
    width: 2,
    height: 80,
    backgroundColor: 'red',
    transformOrigin: 'bottom center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Speedometer;