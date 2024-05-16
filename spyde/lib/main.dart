import 'dart:async';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:wifi_iot/wifi_iot.dart';
import 'package:spyde/magnetometerReader.dart';
import 'package:spyde/speedometer.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized(); // Ensure Flutter is initialized
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Magnetometer App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MagnetometerPage(),
    );
  }
}

class MagnetometerPage extends StatefulWidget {
  @override
  _MagnetometerPageState createState() => _MagnetometerPageState();
}

class _MagnetometerPageState extends State<MagnetometerPage> {
  bool alarmTriggered = false;
  double currentValue = 0.0;
  List<WifiNetwork> wifiNetworks = [];

  @override
  void initState() {
    super.initState();
    _checkPermissions();
    MagnetometerReader().startReading().listen((double data) {
      setState(() {
        currentValue = data;
        if (currentValue > 60.0) {
          alarmTriggered = true;
        } else {
          alarmTriggered = false;
        }
      });
    });

    // Fetch WiFi networks every 3 seconds
    Timer.periodic(Duration(milliseconds: 100), (timer) {
      _fetchWifiNetworks();
    });
  }

  Future<void> _checkPermissions() async {
    if (await Permission.sensors.isGranted && await Permission.location.isGranted) {
      // Permissions already granted
      print('Sensors and Location permissions are granted');
      _fetchWifiNetworks();
    } else {
      // Request permissions
      await Permission.sensors.request();
      await Permission.location.request();
      _fetchWifiNetworks();
    }
  }

  Future<void> _fetchWifiNetworks() async {
    try {
      List<WifiNetwork> networks = await WiFiForIoTPlugin.loadWifiList();
      setState(() {
        wifiNetworks = networks;
      });
    } catch (e) {
      print('Error fetching WiFi networks: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Magnetometer App'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Speedometer(currentValue: currentValue),
          SizedBox(height: 20.0),
          Expanded(
            child: ListView.builder(
              itemCount: wifiNetworks.length,
              itemBuilder: (context, index) {
                WifiNetwork network = wifiNetworks[index];
                return ListTile(
                  title: Text('Name: ${network.ssid}'),
                  subtitle: Text('Signal Strength: ${network.level} dB'),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}