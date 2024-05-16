import 'package:permission_handler/permission_handler.dart';

Future<void> requestPermissions() async {
  // Request sensor permissions
  if (await Permission.sensors.request().isGranted) {
    print('Sensor permissions granted');
  } else {
    print('Sensor permissions denied');
  }

  // Request location permissions
  if (await Permission.location.request().isGranted) {
    print('Location permissions granted');
  } else {
    print('Location permissions denied');
  }

  // Request storage permissions
  if (await Permission.storage.request().isGranted) {
    print('Storage permissions granted');
  } else {
    print('Storage permissions denied');
  }

  // Add more permissions as needed for other services based on the log entries
}