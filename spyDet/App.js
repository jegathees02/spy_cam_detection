import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import WifiManager from 'react-native-wifi-reborn';
// import WifiManager from 'react-native-wifi-reborn';
// import { NetInfo, NetInfoStateType } from '@react-native-community/netinfo'; // Import NetInfo module
// import { NetInfo } from "react-native";
import Speedometer from './components/Speedometer';
// import { addEventListener } from "@react-native-community/netinfo";
// import { fetch } from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";

const App = () => {
  const [avg, setAvg] = useState(0);
  const [wifiList, setWifiList] = useState([]);
  const { type, isConnected } = useNetInfo();
  const netInfoStates = useNetInfo();

  useEffect(() => {
    const requestWifiPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Wi-Fi Permission',
            message: 'This app needs access to your Wi-Fi for network scanning.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Wi-Fi permission granted.');
          scanWifiNetworks(); // Proceed to scan for Wi-Fi networks
        } else {
          console.log('Wi-Fi permission denied.');
        }
      } catch (err) {
        console.error('Error requesting Wi-Fi permission:', err);
      }
    };

    const scanWifiNetworks = async () => {
      try {
        const wifiList = await WifiManager.loadWifiList();
        console.log('Available Wi-Fi networks:', wifiList);
        // Handle the list of Wi-Fi networks (e.g., display in UI)
      } catch (err) {
        console.error('Error scanning Wi-Fi networks:', err);
      }
    };

    // const unsubscribe = NetInfo.addEventListener(state => {
    //   console.log('Connection type', state.type);
    //   console.log('Is connected?', state.isConnected);
    // }); 

    const loadWifiList = async (props = {WifiManager}) => {
      try {
        // if (WifiManager) {
          WifiManager.setEnabled(true);
          const wifiList = await WifiManager.loadWifiList();
          console.log('Wi-Fi List', wifiList);
          setWifiList(wifiList); // Store the list of Wi-Fi networks in state
        // } else {
        //   console.log('WifiManager is not available');
        // }
      } catch (err) {
        console.log(err);
      }
    };

    // const loadWifiList =  async () => {
    //   // unsubscribe(); // Unsubscribe from NetInfo listener
    //   try {
    //      // Fetch current network state
    //     console.log('Connection type', netInfoStates.type);
    //     console.log('Connection type:', netInfoStates.type);
    //     console.log('Is connected?', netInfoStates.isConnected);
    //     const wifiList = await WifiManager.loadWifiList();
    //     setWifiList(wifiList); // Store the list of Wi-Fi networks in state
    //     if (netInfoStates.isConnected && netInfoStates.type === 'wifi') {
    //       console.log(netInfoStates.details.frequency);
    //       // console.log('Wi-Fi List', wifiList);
    //     } else {
    //       console.log('Not connected to a Wi-Fi network');
    //     }
    //   } catch (err) {
    //     console.log('error',err);
    //   }
    // };

    requestWifiPermission(); // Request Wi-Fi permission on component mount

    const subscription = Magnetometer.addListener(result => {
      const { x, y, z } = result;
      const newAvg = Math.abs(x + y + z) / 3;
      setAvg(newAvg);
    });

    return () => {
      subscription.remove(); // Clean up the subscription on component unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Magnetometer:</Text>
      <Speedometer value={avg} />

      <View style={styles.wifiListContainer}>
        <Text style={styles.text}>Available Wi-Fi Networks:</Text>
        {/* {console.log(wifiList)} */}
        {wifiList.map((wifi, index) => (
          <Text key={index}>{wifi.SSID}</Text>
        ))}
      </View>
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
  wifiListContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    maxHeight: 200,
    overflow: 'scroll',
  },
});

export default App;






// // App.js

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Magnetometer } from 'expo-sensors';
// import { Audio } from 'expo-av';
// import { PermissionsAndroid } from 'react-native';
// import { NetInfo } from "react-native";

// import WifiManager from 'react-native-wifi-reborn';
// import Speedometer from './components/Speedometer';
// // import WifiPermission from './components/wifiPermission';
// // import WifiPermission from './components/WifiPermission';
// // import WifiPermission from './components/WifiPermission';
// // import WifiList from './components/WifiList';
// // import WifiList from './components/getWifiDetail';

// const App = () => {
//   const [avg, setAvg] = useState(0);
//   const [wifiList, setWifiList] = useState([]);

//   useEffect(() => {
    

//     const requestWifiPermission = async () => {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Wi-Fi Permission',
//             message: 'This app needs access to your Wi-Fi ' +
//               'so we can detect the signal strength.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           // Permission granted, proceed to fetch Wi-Fi list
//           loadWifiList(); // Call your function to fetch Wi-Fi list
//         } else {
//           console.log('Wi-Fi permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     };

//     const loadWifiList = async () => {
//       try {
//         const wifiList = await WifiManager.loadWifiList();
//         console.log(wifiList); // Log the list of Wi-Fi networks
//         setWifiList(wifiList); // Store the Wi-Fi list in component state
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     const subscription = Magnetometer.addListener(result => {
//       const { x, y, z } = result;
//       const newAvg = Math.abs(x + y + z) / 3;
//       setAvg(newAvg);
//     });

//     requestWifiPermission();

//     // return () => {
//     //   subscription.remove(); // Clean up the subscription on component unmount
//     // };
//   }, []);

//   return (
//     <>
//     <View style={styles.container}>
//       {/* <WifiPermission /> Request Wi-Fi permissions and fetch list */}
//       {/* <WifiList /> Display the list of available Wi-Fi networks */}
//       <Text style={styles.text}>Magnetometer:</Text>
//       <Speedometer value={avg} />
//     </View>
//     <View>
//     {wifiList.map((wifi, index) => (
//       <Text key={index}>{wifi.SSID}</Text>
//     ))}
//   </View>
//   </>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   speedometer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   needle: {
//     width: 2,
//     height: 80,
//     backgroundColor: 'red',
//     transformOrigin: 'bottom center',
//   },
//   value: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
// });

// export default App;





















// // import React, { useState, useEffect } from 'react';
// // import { StyleSheet, Text, View, Animated } from 'react-native';
// // import { Magnetometer } from 'expo-sensors';
// // import { Audio } from 'expo-av';
// // import { PermissionsAndroid } from 'react-native';
// // import WifiPermission from './components/wifiPermission';
// // import WifiList from './components/getWifiDetail';

// // const Speedometer = ({ value }) => {
// //   const rotation = new Animated.Value(-90);

// //   useEffect(() => {
// //     // Calculate angle based on value (assuming max value is 100)
// //     const angle = (value / 100) * 180;

// //     // Animate the rotation of the needle
// //     Animated.timing(rotation, {
// //       toValue: angle,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start();
// //   }, [value]);

// //   return (
// //     <View style={styles.speedometer}>
// //       <Animated.View
// //         style={[
// //           styles.needle,
// //           {
// //             transform: [{ rotate: rotation.interpolate({
// //               inputRange: [0, 180],
// //               outputRange: ['0deg', '180deg'],
              
// //             }) }],
// //           },
// //         ]}
// //       />
// //       <Text style={styles.value}>{value.toFixed(2)} μT</Text>
// //     </View>
// //   );
// // };

// // export default function App() {
// //   const [avg, setAvg] = useState(0);
// //   const [sound, setSound] = useState(null);
// //   const [isPlaying, setIsPlaying] = useState(false);

// //   const loadSounds = async () => {
// //     const { sound } = await Audio.Sound.createAsync(
// //       require('./assets/audio/sound1.mp3')
// //     );
// //     setSound(sound);
// //   };

// //   const playSound = async () => {
// //     await sound.replayAsync();
// //     // setIsPlaying(true);
// //   };

// //   const stopSound = async () => {
// //      sound.stopAsync();
// //     // setIsPlaying(false);
// //   };

// //   const _subscribe = async () => {
// //     Magnetometer.addListener(async result => {
// //       const microTeslaData = {
// //         x: result.x * 1,
// //         y: result.y * 1,
// //         z: result.z * 1,
// //       };
// //       const newAvg = Math.abs(microTeslaData.x + microTeslaData.y + microTeslaData.z) / 3;
// //       setAvg(newAvg);

// //       if (newAvg > 70) {
// //         playSound();
// //         setIsPlaying(true);
// //       } else {
// //         stopSound();
// //         setIsPlaying(false);
// //       }
// //     });
// //   };

// //   useEffect(() => {
// //     loadSounds();
// //     _subscribe();

// //     // return () => {
// //     //   Magnetometer.removeAllListeners();
// //     // };
// //   }, []);

// //   return (
// //     <>
// //       <WifiPermission /> {/* Request Wi-Fi permissions and fetch list */}
// //       <WifiList />
// //       <View style={styles.container}>
// //       <Text style={styles.text}>Magnetometer:</Text>
// //       <Speedometer value={avg} />
// //     </View>
// //     </>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //   },
// //   text: {
// //     fontSize: 16,
// //     marginBottom: 16,
// //   },
// //   speedometer: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   needle: {
// //     width: 2,
// //     height: 80,
// //     backgroundColor: 'red',
// //     transformOrigin: 'bottom center',
// //   },
// //   value: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginTop: 20,
// //   },
// // });