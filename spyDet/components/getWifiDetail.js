// WifiList.js

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

const WifiList = () => {
  

  useEffect(() => {
    const loadWifiList = async () => {
      try {
        const wifiList = await WifiManager.loadWifiList();
        console.log(wifiList); // Log the list of Wi-Fi networks
        setWifiList(wifiList); // Store the Wi-Fi list in component state
      } catch (err) {
        console.log(err);
      }
    };

    loadWifiList();
  }, []);

  return (
    <View>
      {wifiList.map((wifi, index) => (
        <Text key={index}>{wifi.SSID}</Text>
      ))}
    </View>
  );
};

export default WifiList;
