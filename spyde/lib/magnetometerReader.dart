import 'package:sensors_plus/sensors_plus.dart';
import 'dart:math';

class MagnetometerReader {
  Stream<double> startReading() {
    return magnetometerEvents.map((event) {
      // Calculate the magnitude of the magnetic field in microtesla
      double magnitude = _calculateMagnitude(event);
      return magnitude;
    });
  }

  double _calculateMagnitude(MagnetometerEvent event) {
    double x = event.x ?? 0.0;
    double y = event.y ?? 0.0;
    double z = event.z ?? 0.0;
    // Calculate the magnitude using Euclidean distance formula
    

    return sqrt(x * x + y * y + z * z);
  }
}
