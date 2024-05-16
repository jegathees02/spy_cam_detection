import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Audio } from 'expo-av';


export default function App() {
  const [avg, setAvg] = useState(0);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [averageMicroTesla, setAverageMicroTesla] = useState(0);

  const loadSounds = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/audio/sound1.mp3')
    );
    setSound(sound);
  };

  const playSound = async () => {
    // if (!isPlaying) {
      await sound.playAsync();
      setIsPlaying(true);
    // }
  };

  const stopSound = async () => {
    // if (isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
    // }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(async result => {
        const microTeslaData = {
          x: result.x * 1,
          y: result.y * 1,
          z: result.z * 1,
        };
        setData(microTeslaData);
        setAvg(Math.abs(microTeslaData.x + microTeslaData.y + microTeslaData.z) / 3);
        setAverageMicroTesla(avg);

        if (avg > 70) {
          await playSound();
        } else {
          await stopSound();
        }
      })
    );
  };



  useEffect(() => {
    _subscribe();
    loadSounds();

    setTimeout(() => {
      _subscribe();
    }, 1000);
    // return () => {
    //   _unsubscribe();
    // };
  }, []);

  return (
    <View style={styles.container}>
      {/* Custom-built Speedometer */}
      {/* <Speedometer
        value={averageMicroTesla || 0} // Display average microtesla value
        max={100} // Max value for the speedometer
        angle={180} // Angle of the speedometer arc
      >
        <Background angle={180} />
        <Arc />
        <Needle />
        <Progress />
        <Marks />
        <Indicator>
          {(value, textProps) => (
            <Text
              {...textProps}
              fontSize={40}
              fill="#555"
              x={150}
              y={150}
              textAnchor="middle"
            >
              {parseInt(value).toFixed(2)} μT
            </Text>
          )}
        </Indicator>
      </Speedometer> */}

      {/* Display Magnetometer Data */}
      <Text style={styles.text}>Magnetometer:</Text>
      <Text>{avg}</Text>

      {/* Subscription Controls */}
      <View style={styles.buttonContainer}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#90EE90',
  },
});
