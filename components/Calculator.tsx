// Calculator.tsx
import {
    fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9,
    faArrowLeft, faArrowsSpin, faBrain, faBug, faCircleDot, faDivide,
    faEquals, faHandshake, faInfinity, faMinus, faPlus, faPlusMinus, faToilet, faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import OperationDisplay from "@/components/OperationDisplay";
import NumberToIcons from "@/components/NumberToIcons";
import CalcButton from "@/components/CalcButton";
import {Operation} from "@/interfaces/Operation";
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import Confetti from 'react-native-confetti';
import React, {useEffect} from 'react';
import Grid from "@/components/Grid";
import styles from "@/styles/styles";
import {Debug, debugOptions, openPrompt} from "@/scripts/debug";
import useStateStorage from "@/interfaces/UseState";
import Toast from "react-native-toast-message";
import { Audio } from 'expo-av';
import {assert} from "realm/dist/assert";
import boolean = assert.boolean;
import DynamicModal from "@/components/DynamicModal";
// import AsyncStorage from "@react-native-async-storage/async-storage";
//
// AsyncStorage.clear().then();

const rows = [
    [fa7, fa8, fa9],
    [fa4, fa5, fa6],
    [fa1, fa2, fa3],
    [faCircleDot, fa0, faMinus],
];

export default function Calculator() {
    const [ sound, _, setSound ] = useStateStorage<Audio.Sound | null>(null);
    const [ experience, getExperience, setExperience ] = useStateStorage<number>(0, 'experience');
    const [ minValue, getMinValue, setMinValue ] = useStateStorage<number>(0, 'minValue');
    const [ maxValue, getMaxValue, setMaxValue ] = useStateStorage<number>(0, 'maxValue');
    const [ unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons ] = useStateStorage<IconDefinition[]>([faPlus], 'unlockedOperationIcons');
    const [ solvedOperations, getSolvedOperations, setSolvedOperations ] = useStateStorage<Operation[]>([], 'solvedOperations');
    const [ capInfinity, getCapInfinity, setCapInfinity ] = useStateStorage<boolean>(false, 'capInfinity');
    const [ unlockedSpecials, getUnlockedSpecials, setUnlockedSpecials ] = useStateStorage<('infinity'|'negatives')[]>([], 'unlockedSpecials');

    function generateNewOperation() {
        let aValue = Math.floor(Math.random() * (getMaxValue() - getMinValue() + 1) + getMinValue());
        let bValue = Math.floor(Math.random() * (getMaxValue() - getMinValue() + 1) + getMinValue());
        let operationIcon = getUnlockedOperationIcons()[Math.floor(Math.random() * getUnlockedOperationIcons().length)];
        if (operationIcon.iconName === 'minus') {
            aValue = Math.floor(aValue / 3);
            bValue = Math.floor(bValue / 3);
        }
        if (operationIcon.iconName === 'xmark') {
            aValue = Math.floor(aValue / 7);
            bValue = Math.floor(bValue / 7);
        }
        if (operationIcon.iconName === 'divide') {
            aValue = Math.floor(aValue / 15);
            bValue = Math.floor(bValue / 15);
        }
        let operation = { aValue, bValue, operationIcon };
        while (solvedOperations.some(op => op.aValue === operation.aValue && op.bValue === operation.bValue && op.operationIcon.iconName === operation.operationIcon.iconName)) {
            operation = generateNewOperation();
        }
        return operation;
    }

    const [ currentOperation, getCurrentOperation, setCurrentOperation ] = useStateStorage<Operation>(generateNewOperation());
    const [ inputValue, getInputValue, setInputValue ] = useStateStorage<string>('');
    const [ pass, getPass, setPass ] = useStateStorage<boolean>(false);

    let explosion: Confetti | null;

    const playSound = async (name: 'click' | 'correct' | 'incorrect' = 'click') => {
        const sounds = {
            click: require('../assets/sounds/click.wav'),
            correct: require('../assets/sounds/correct.mp3'),
            incorrect: require('../assets/sounds/incorrect.wav'),
        };
        const { sound } = await Audio.Sound.createAsync(sounds[name]);
        setSound(sound);
        await sound.playAsync();
    };

    useEffect(() => {
        return sound ? () => {sound.unloadAsync()} : undefined;
    }, [sound]);

    const checkOperation = () => {
        if (getCapInfinity()) {
            if (getInputValue() === '±∞') {
                playSound('correct').then();
                setInputValue('');
                setExperience(getExperience() + 50);
                setSolvedOperations([...getSolvedOperations(), getCurrentOperation()]);
                setMaxValue(getMaxValue() + 1);
                setCurrentOperation(generateNewOperation());
                setUnlockedSpecials([...getUnlockedSpecials(), 'infinity']);
                setCapInfinity(getCurrentOperation().bValue === 0 && getCurrentOperation().operationIcon.iconName === 'divide');
                return;
            }
            playSound('incorrect').then(() => setExperience(getExperience() - 1));
            return;
        }

        const result = calculateResult(getCurrentOperation());
        const resultValue = Number(result.value.toFixed(1));
        const inputValueValue = Number(parseFloat(getInputValue()).toFixed(1));
        if (inputValueValue !== resultValue)
            return playSound('incorrect').then(() => setExperience(getExperience() - 1));
        playSound('correct').then();
        setInputValue('');
        setExperience(getExperience() + result.xp);
        setSolvedOperations([...getSolvedOperations(), getCurrentOperation()]);
        setMaxValue(getMaxValue() + 1);
        setCurrentOperation(generateNewOperation());

        setCapInfinity(getCurrentOperation().bValue === 0 && getCurrentOperation().operationIcon.iconName === 'divide');

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

    const handlePress = (icon: IconDefinition | 'capInfinity') => {
        playSound('click').then();

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

    const wipeData = () => {
        setExperience(0);
        setMinValue(0);
        setMaxValue(0);
        setUnlockedOperationIcons([faPlus]);
        setSolvedOperations([]);
    };

    const divideByZero = () => {
        const currentOperation = getCurrentOperation();
        currentOperation.bValue = 0;
        currentOperation.operationIcon = faDivide;
        setCurrentOperation(currentOperation);
        setCapInfinity(true);
    };

    return (
        <View style={styles.container}>
            <Header experience={experience} debugOptions={{ wipeData, divideByZero }} />
            <Body
                currentOperation={currentOperation}
                inputValue={inputValue}
                setInputValue={setInputValue}
                checkOperation={checkOperation}
                handlePress={handlePress}
                generateNewOperation={() => setCurrentOperation(generateNewOperation())}
                capInfinity={capInfinity}
            />
            <Confetti ref={ref => (explosion = ref)} duration={1000} confettiCount={20} timeout={1} />
            <Debug />
            <Toast />
        </View>
    );
}

const calculateResult = (operation: Operation) => {
    const { aValue, bValue, operationIcon } = operation;
    switch (operationIcon.iconName) {
        case 'plus':
            return { value: aValue + bValue, xp: aValue.toString().length + bValue.toString().length + (aValue+bValue).toString().length };
        case 'minus':
            return { value: aValue - bValue, xp: (aValue.toString().length + bValue.toString().length + (aValue+bValue).toString().length)*2 };
        case 'xmark':
            return { value: aValue * bValue, xp: 10 };
        case 'divide':
            return { value: aValue / bValue, xp: (aValue/bValue).toString().length*20 };
        default:
            return { value: 0, xp: 0 };
    }
};

const Header = ({ experience, debugOptions }: { experience: number, debugOptions: debugOptions }) => (
    <View style={styles.header}>
        <FontAwesomeIcon icon={faBrain} />
        <NumberToIcons number={experience} />
        <View style={styles.headerSpacer} />
        <CalcButton icon={faBug} onPress={() => openPrompt(debugOptions)} style={styles.debugButton} />
    </View>
);

const Body = ({ currentOperation, inputValue, setInputValue, checkOperation, handlePress, generateNewOperation, capInfinity }: {
    currentOperation: Operation;
    inputValue: string;
    setInputValue: (value: string) => void;
    checkOperation: () => void;
    handlePress: (icon: IconDefinition | 'capInfinity') => void;
    generateNewOperation: () => void;
    capInfinity: boolean;
}) => (
    <View style={styles.body}>
        <View style={styles.layout1}>
            <View style={styles.question}>
                <OperationDisplay {...currentOperation} />
                <CalcButton icon={faArrowsSpin} onPress={generateNewOperation} style={styles.returnButton} />
            </View>
            <View style={styles.result}>
                <FontAwesomeIcon icon={faEquals} />
                <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={inputValue}
                    onChangeText={(value) => setInputValue(value)}
                />
                <CalcButton icon={faArrowLeft} onPress={() => setInputValue(inputValue.slice(0, -1))} style={styles.returnButton} />
            </View>
            <CalcButton icon={faHandshake} onPress={checkOperation} style={styles.resultButton} />
        </View>
        <View style={styles.layout2}>
            {rows.map((row, index) => (
                <View key={index} style={styles.l2Row}>
                    <Grid items={row} onPress={handlePress} capInfinity={capInfinity} />
                </View>
            ))
                // :<View style={styles.l2Row}>
                //     <View style={styles.gridItem}>
                //         <TouchableOpacity onPress={() => handlePressCapInfinity()} style={{...styles.calcButton, flexDirection: 'row'}}>
                //             <FontAwesomeIcon icon={faPlusMinus} style={styles.calcText} />
                //             <FontAwesomeIcon icon={faInfinity} style={styles.calcText} />
                //         </TouchableOpacity>
                //     </View>
                // </View>
            }
        </View>
    </View>
);