import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Audio } from "expo-av";
import { Accelerometer } from 'expo-sensors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    shakeText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
});

export default function App() {
    const [mySound, setMySound] = useState();
    const [isShakeDetected, setIsShakeDetected] = useState(false);

    async function playSound() {
        const soundfile = require('./short1.wav');
        const { sound } = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        let lastX = 0, lastY = 0, lastZ = 0;

        const subscription = Accelerometer.addListener(({ x, y, z }) => {
            const deltaX = Math.abs(x - lastX);
            const deltaY = Math.abs(y - lastY);
            const deltaZ = Math.abs(z - lastZ);

            if (deltaX + deltaY + deltaZ > 1.2) {
                setIsShakeDetected(true);
                playSound();
            } else {
                setIsShakeDetected(false);
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        });

        Accelerometer.setUpdateInterval(100);

        return () => {
            subscription && subscription.remove();
            if (mySound) {
                mySound.unloadAsync();
            }
        };
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            {isShakeDetected && <Text style={styles.shakeText}>SHAKE!</Text>}
        </View>
    );
}
