// import 'package:flutter/material.dart';
// import 'package:audioplayers/audio_cache.dart';

// class Alarm extends StatefulWidget {
//   final bool isTriggered;

//   Alarm({required this.isTriggered});

//   @override
//   _AlarmState createState() => _AlarmState();
// }

// class _AlarmState extends State<Alarm> {
//   late AudioCache _audioCache;

//   @override
//   void initState() {
//     super.initState();
//     _audioCache = AudioCache();
//   }

//   @override
//   void didUpdateWidget(Alarm oldWidget) {
//     super.didUpdateWidget(oldWidget);
//     if (widget.isTriggered && !oldWidget.isTriggered) {
//       _playAlarmSound();
//     }
//   }

//   Future<void> _playAlarmSound() async {
//     await _audioCache.play('audio/sound1.mp3');
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: EdgeInsets.all(16.0),
//       alignment: Alignment.center,
//       child: widget.isTriggered
//           ? Text(
//               'ALARM Magnetic Field Exceeded 60 µT',
//               style: TextStyle(
//                 fontSize: 20.0,
//                 fontWeight: FontWeight.bold,
//                 color: Colors.red,
//               ),
//             )
//           : SizedBox(), // Display nothing if alarm is not triggered
//     );
//   }
// }