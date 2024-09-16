import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {playSound} from "@/sound/soundManager";
import {Audio} from "expo-av";
import {Operation} from "@/interfaces/Operation";
import {calculateResult} from "@/logic/calculatorLogic";
import Toast from "react-native-toast-message";
import Confetti from "react-native-confetti";
import {faDivide, faMinus, faXmark} from "@fortawesome/free-solid-svg-icons";

export function handlePressGen(
    setSound: (sound: Audio.Sound | null) => void,
    getInputValue: () => string,
    setInputValue: (value: string) => void,
    getCurrentOperation: () => Operation,
    calculateResult: (operation: Operation) => { value: number, xp: number },
    checkOperation: () => undefined | Promise<void>,
    setPass: (value: boolean) => void,
    getPass: () => boolean,
) {
    return (icon: IconDefinition | 'capInfinity') => {
        playSound('click', setSound).then();

        if (icon === 'capInfinity') {
            setInputValue('±∞');
            return;
        }

        const symbolMap: { [key: string]: string } = {
            minus: '-',
            'circle-dot': '.',
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        };
        const symbol = symbolMap[icon.iconName] || '';
        const newValue = getInputValue() + symbol;
        const result = calculateResult(getCurrentOperation());
        setInputValue(newValue.toString());

        if (getPass() || (result.value.toString().length !== newValue.toString().length)) return;
        if (parseFloat(newValue) === result.value) checkOperation()?.then();
        else setPass(true);
    };
}

export function checkOpGen(
    setSound: (sound: Audio.Sound | null) => void,
    getInputValue: () => string,
    setInputValue: (value: string) => void,
    getCurrentOperation: () => Operation,
    calculateResult: (operation: Operation) => { value: number, xp: number },
    setExperience: (value: number) => void,
    getExperience: () => number,
    setSolvedOperations: (value: Operation[]) => void,
    getSolvedOperations: () => Operation[],
    getUnlockedSpecials: () => ('infinity' | 'negatives')[],
    setUnlockedSpecials: (value: ('infinity' | 'negatives')[]) => void,
    setMaxValue: (value: number) => void,
    getMaxValue: () => number,
    setCurrentOperation: (value: Operation) => void,
    generateNewOperation: () => Operation,
    setCapInfinity: (value: boolean) => void,
    getCapInfinity: () => boolean,
    setUnlockedOperationIcons: (value: IconDefinition[]) => void,
    getUnlockedOperationIcons: () => IconDefinition[],
    setPass: (value: boolean) => void,
    getExplosion: () => (Confetti | null),
) {
    return () => {
        if (getCapInfinity()) {
            if (getInputValue() === '±∞') {
                playSound('correct', setSound).then();
                setInputValue('');
                setExperience(getExperience() + 50);
                setSolvedOperations([...getSolvedOperations(), getCurrentOperation()]);
                setMaxValue(getMaxValue() + 1);
                setCurrentOperation(generateNewOperation());
                setUnlockedSpecials([...getUnlockedSpecials(), 'infinity']);
                setCapInfinity(getCurrentOperation().bValue === 0 && getCurrentOperation().operationIcon.iconName === 'divide');
                return;
            }
            playSound('incorrect', setSound).then(() => setExperience(getExperience() - 1));
            return;
        }

        const result = calculateResult(getCurrentOperation());
        const resultValue = Number(result.value.toFixed(1));
        const inputValueValue = Number(parseFloat(getInputValue()).toFixed(1));
        if (inputValueValue !== resultValue)
            return playSound('incorrect', setSound).then(() => setExperience(getExperience() - 1));
        playSound('correct', setSound).then();
        setInputValue('');
        setExperience(getExperience() + result.xp);
        setSolvedOperations([...getSolvedOperations(), getCurrentOperation()]);
        setMaxValue(getMaxValue() + 1);
        setCurrentOperation(generateNewOperation());

        setCapInfinity(getCurrentOperation().bValue === 0 && getCurrentOperation().operationIcon.iconName === 'divide');

        const explosion = getExplosion();
        if (explosion) explosion.startConfetti();
        setPass(false);
        Toast.show({
            type: 'success',
            text1: 'Correcto',
            text2: `+${result.xp} XP`,
            visibilityTime: 1000,
            position: 'bottom',
        });
        if (getExperience() >= 10 && !getUnlockedOperationIcons().map(icon => icon.iconName).includes('minus')) {
            setUnlockedOperationIcons([...getUnlockedOperationIcons(), faMinus]);
            Toast.show({
                type: 'success',
                text1: 'Nuevo icono desbloqueado',
                text2: 'Operación de resta',
                visibilityTime: 2000,
                position: 'bottom',
            });
        }
        if (getExperience() >= 100 && !getUnlockedOperationIcons().map(icon => icon.iconName).includes('xmark')) {
            setUnlockedOperationIcons([...getUnlockedOperationIcons(), faXmark]);
            Toast.show({
                type: 'success',
                text1: 'Nuevo icono desbloqueado',
                text2: 'Operación de multiplicación',
                visibilityTime: 2000,
                position: 'bottom',
            });
        }
        if (getExperience() >= 300 && !getUnlockedOperationIcons().map(icon => icon.iconName).includes('divide')) {
            setUnlockedOperationIcons([...getUnlockedOperationIcons(), faDivide]);
            Toast.show({
                type: 'success',
                text1: 'Nuevo icono desbloqueado',
                text2: 'Operación de división',
                visibilityTime: 2000,
                position: 'bottom',
            });
        }
    };
}