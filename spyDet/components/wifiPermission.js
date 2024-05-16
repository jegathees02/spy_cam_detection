// WifiPermission.js

import React, { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import { getWifiList } from './getWifiDetail';

const WifiPermission = () => {
  useEffect(() => {
    const requestWifiPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Wi-Fi Permission',
            message: 'This app needs access to your Wi-Fi ' +
              'so we can detect the signal strength.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted, proceed to fetch Wi-Fi list
          getWifiList(); // Call your function to fetch Wi-Fi list
        } else {
          console.log('Wi-Fi permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestWifiPermission();
  }, []);

  return null; // This component doesn't render anything
};

export default WifiPermission;
