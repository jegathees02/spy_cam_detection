import 'package:flutter/material.dart';
import 'package:wifi_iot/wifi_iot.dart';
import 'package:permission_handler/permission_handler.dart';

Future<bool> requestWifiPermissions() async {
  // Request ACCESS_WIFI_STATE permission
  if (await Permission.location.request().isGranted) {
    // Request CHANGE_WIFI_STATE permission
    if (await Permission.locationWhenInUse.request().isGranted) {
      return true;
    }
  }
  return false;
}

Future<List<WifiNetwork>> getNearbyWifiNetworks() async {
  // Request permissions
  bool permissionsGranted = await requestWifiPermissions();
  if (!permissionsGranted) {
    return [];
  }

  // Fetch WiFi list
  final List<WifiNetwork> wifiList = await WiFiForIoTPlugin.loadWifiList();
  return wifiList;
}

Future<void> showWifiNetworks(BuildContext context) async {
  List<WifiNetwork> wifiList = await getNearbyWifiNetworks();
  if (wifiList.isEmpty) {
    // Permissions not granted
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Permissions Required'),
          content: Text('Please grant the necessary permissions to access WiFi networks.'),
          actions: [
            TextButton(
              child: Text('OK'),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  } else {
    // Display WiFi networks
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Nearby WiFi Networks'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: wifiList.map((wifi) {
              return ListTile(
                title: Text('${wifi.ssid}'),
                subtitle: Text('Signal Strength: ${wifi.level}'),
              );
            }).toList(),
          ),
          actions: [
            TextButton(
              child: Text('Close'),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }
}