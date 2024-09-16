// useOperationManagement.ts
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Operation } from '@/interfaces/Operation'; // Asegúrate de ajustar la ruta de Operation
import useStateStorage from '@/interfaces/UseState';
import { Audio } from 'expo-av';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {genOpGen} from "@/logic/generateOperation";
import Confetti from "react-native-confetti";

const useOperationManagement = () => {
    const [ sound, _, setSound ] = useStateStorage<Audio.Sound | null>(null);
    const [ experience, getExperience, setExperience ] = useStateStorage<number>(0, 'experience');
    const [ minValue, getMinValue, setMinValue ] = useStateStorage<number>(0, 'minValue');
    const [ maxValue, getMaxValue, setMaxValue ] = useStateStorage<number>(0, 'maxValue');
    const [ unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons ] = useStateStorage<IconDefinition[]>([faPlus], 'unlockedOperationIcons');
    const [ solvedOperations, getSolvedOperations, setSolvedOperations ] = useStateStorage<Operation[]>([], 'solvedOperations');
    const [ capInfinity, getCapInfinity, setCapInfinity ] = useStateStorage<boolean>(false, 'capInfinity');
    const [ unlockedSpecials, getUnlockedSpecials, setUnlockedSpecials ] = useStateStorage<('infinity'|'negatives')[]>([], 'unlockedSpecials');

    // Utilizando `genOpGen` sin parámetros.
    const generateNewOperation = genOpGen();

    const [ currentOperation, getCurrentOperation, setCurrentOperation ] = useStateStorage<Operation>(generateNewOperation());
    const [ inputValue, getInputValue, setInputValue ] = useStateStorage<string>('');
    const [ pass, getPass, setPass ] = useStateStorage<boolean>(false);
    const [ explosion, getExplosion, setExplosion ] = useStateStorage<Confetti | null>(null);

    return {
        sound, setSound,
        experience, getExperience, setExperience,
        minValue, getMinValue, setMinValue,
        maxValue, getMaxValue, setMaxValue,
        unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons,
        solvedOperations, getSolvedOperations, setSolvedOperations,
        capInfinity, getCapInfinity, setCapInfinity,
        unlockedSpecials, getUnlockedSpecials, setUnlockedSpecials,
        currentOperation, getCurrentOperation, setCurrentOperation,
        inputValue, getInputValue, setInputValue,
        pass, getPass, setPass,
        explosion, getExplosion, setExplosion,
        generateNewOperation
    };
};

export default useOperationManagement;
