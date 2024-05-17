import 'dart:async';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:spyde/popup_card.dart';
import 'package:wifi_iot/wifi_iot.dart';
import 'package:spyde/magnetometerReader.dart';
import 'package:spyde/speedometer.dart';
import 'package:audioplayers/audioplayers.dart';

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
  double magnetometerValue = 0.0;
  double maxWifiSignalStrength =
      -100.0; // Initialized to a very low signal strength
  double spydScore = 0.0;
  List<WifiNetwork> wifiNetworks = [];
  AudioPlayer audioPlayer = AudioPlayer();
  String _spydScoreMessage = '';

  @override
  void initState() {
    super.initState();
    _checkPermissions();
    MagnetometerReader().startReading().listen((double data) {
      setState(() {
        magnetometerValue = data;
        _updateSpydScore();
      });
    });
    _fetchWifiNetworks();

    // Fetch WiFi networks every second
    Timer.periodic(Duration(milliseconds: 1000), (timer) {
      _fetchWifiNetworks();
    });
  }

  Future<void> _checkPermissions() async {
    if (await Permission.sensors.isGranted &&
        await Permission.location.isGranted) {
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
        maxWifiSignalStrength = networks
            .map((network) => network.level?.toDouble())
            .fold<double>(
                -100.0, (prev, level) => level! > prev ? level : prev);
        _updateSpydScore();
      });
    } catch (e) {
      print('Error fetching WiFi networks: $e');
    }
  }

  void _updateSpydScore() {
    // Use only magnetometer value if no Wi-Fi signal is found
    if (wifiNetworks.isEmpty) {
      spydScore = magnetometerValue;
    } else {
      spydScore = magnetometerValue +
          maxWifiSignalStrength; // Adjust this formula as needed
    }

    if (spydScore > 60.0) {
      // if (!alarmTriggered) {
      if (spydScore > 100.0) spydScore = 100.0;
      alarmTriggered = true;
      _spydScoreMessage = 'Spyd Score Exceeded: $spydScore';
      _playAlarm();
      // }
    } else {
      if (spydScore < 0.0) spydScore = 0.0;
      if (alarmTriggered) {
        alarmTriggered = false;
        _spydScoreMessage = '';
        _stopAlarm();
      }
    }
  }

  void _playAlarm() async {
    await audioPlayer.play(AssetSource('audio/sound1.mp3'));
  }

  void _stopAlarm() async {
    await audioPlayer.stop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Spy Camera Detector'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Speedometer(currentValue: spydScore),
          SizedBox(height: 20.0),
          Text(
            _spydScoreMessage,
            style: TextStyle(
              color: alarmTriggered ? Colors.red : Colors.black,
              fontSize: 20,
            ),
          ),
          SizedBox(height: 20.0),
          Expanded(
            child: ListView.builder(
              itemCount: wifiNetworks.length,
              itemBuilder: (context, index) {
                WifiNetwork network = wifiNetworks[index];
                title: Text('Wi-Fi Networks');
                return ListTile(
                  title: Text('Name: ${network.ssid}'),
                  subtitle: Text('Signal Strength: ${network.level} dB'),
                );
              },
            ),
          ),
        ],
      ),
      // Add a floating action button
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              // Return the PopupCard widget
              return PopupCard();
            },
          );
        },
        child: Icon(Icons.info),
      ),
    );
  }
}
