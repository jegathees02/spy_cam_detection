import 'package:flutter/material.dart';

class PopupCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('About Spyd Detector'),
      content: Text(
        'Spyd Detector is an app that helps in detecting spy cameras by analyzing magnetometer readings and Wi-Fi signal strengths. It calculates a Spyd Score based on these factors. If the score exceeds a certain threshold, an alarm is triggered.',
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text('Close'),
        ),
      ],
    );
  }
}
