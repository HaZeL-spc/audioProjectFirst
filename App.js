import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  const buttonHandler = async () => {
    console.log(hasStarted);
    setHasStarted(!hasStarted);

    if (!hasStarted) {
      try {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        setRecording(recording);
      } catch (err) {}
    } else {
      setKey(key + 1);
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log(uri);

      const { sound } = await Audio.Sound.createAsync(
        { uri: uri },
        { shouldPlay: true }.uri
      );
      console.log(sound.playAsync());

      setSound(sound);

      await sound.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.5} onPress={buttonHandler}>
        <CountdownCircleTimer
          key={key}
          isPlaying={hasStarted}
          onComplete={buttonHandler}
          duration={10}
          colors={[
            ["#34B3F6", 0.3],
            ["#4145FB", 0.3],
            ["#A741FB", 0.4],
          ]}
        >
          {({ remainingTime, animatedColor }) => (
            <LinearGradient
              colors={["#34B3F6", "#4145FB", "#A741FB"]}
              style={styles.linearGradient}
            >
              <Animated.Text
                style={{ color: animatedColor, fontSize: 40, color: "white" }}
              >
                {remainingTime}
              </Animated.Text>
            </LinearGradient>
          )}
        </CountdownCircleTimer>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9E9",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
  },
  linearGradient: {
    width: 170,
    height: 170,
    borderRadius: 170 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
