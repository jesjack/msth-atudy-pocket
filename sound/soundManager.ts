// soundManager.ts
import { Audio } from 'expo-av';

export const playSound = async (name: 'click' | 'correct' | 'incorrect' = 'click', setSound: (sound: Audio.Sound | null) => void) => {
    const sounds = {
        click: require('../assets/sounds/click.wav'),
        correct: require('../assets/sounds/correct.mp3'),
        incorrect: require('../assets/sounds/incorrect.wav'),
    };
    const { sound } = await Audio.Sound.createAsync(sounds[name]);
    setSound(sound);
    await sound.playAsync();
};
