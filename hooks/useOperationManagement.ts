import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Operation } from '@/interfaces/Operation'; // Asegúrate de ajustar la ruta de Operation
import useStateStorage from '@/interfaces/UseState';
import { Audio } from 'expo-av';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { genOpGen } from "@/logic/generateOperation";
import Confetti from "react-native-confetti";
import { useEffect, useRef } from 'react';
import useGenOpParams from './useGenOpParams';

const useOperationManagement = () => {
    const isInitialized = useRef(false); // Para evitar re-inicializar los valores.

    const useGenOpParams_ = useGenOpParams();
    const { minValue, getMinValue, setMinValue,
        maxValue, getMaxValue, setMaxValue,
        unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons,
        solvedOperations, getSolvedOperations, setSolvedOperations,
        unlockedAchievements, getUnlockedAchievements, setUnlockedAchievements
    } = useGenOpParams_;

    const generateNewOperation = useRef(genOpGen(useGenOpParams_)).current;

    const [ currentOperation, getCurrentOperation, setCurrentOperation ] = useStateStorage<Operation>(generateNewOperation());
    const [ inputValue, getInputValue, setInputValue ] = useStateStorage<string>('');
    const [ pass, getPass, setPass ] = useStateStorage<boolean>(false);
    const [ explosion, getExplosion, setExplosion ] = useStateStorage<Confetti | null>(null);
    const [ sound, _, setSound ] = useStateStorage<Audio.Sound | null>(null);
    const [ experience, getExperience, setExperience ] = useStateStorage<number>(0, 'experience');
    const [ capInfinity, getCapInfinity, setCapInfinity ] = useStateStorage<boolean>(false, 'capInfinity');

    useEffect(() => {
        if (!isInitialized.current) {
            // Realiza aquí alguna lógica que solo necesites hacer una vez
            // como la carga inicial de valores o inicialización de variables.
            isInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync().catch(err => console.error('Error unloading sound', err));
            }
        };
    }, [sound]);

    return {
        sound, setSound,
        experience, getExperience, setExperience,
        minValue, getMinValue, setMinValue,
        maxValue, getMaxValue, setMaxValue,
        unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons,
        solvedOperations, getSolvedOperations, setSolvedOperations,
        capInfinity, getCapInfinity, setCapInfinity,
        currentOperation, getCurrentOperation, setCurrentOperation,
        inputValue, getInputValue, setInputValue,
        pass, getPass, setPass,
        explosion, getExplosion, setExplosion,
        generateNewOperation,
        unlockedAchievements, getUnlockedAchievements, setUnlockedAchievements
    };
};

export default useOperationManagement;
