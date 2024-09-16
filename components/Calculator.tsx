// Calculator.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {Operation} from "@/interfaces/Operation";
import {Audio} from "expo-av";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useThemeColor} from "@/hooks/useThemeColor";
import useStateStorage from "@/interfaces/UseState";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {playSound} from "@/sound/soundManager";
import {genOpGen} from "@/logic/generateOperation";
import {calculateResult} from "@/logic/calculatorLogic";
import Confetti from "react-native-confetti";
import Toast from "react-native-toast-message";
import styles from "@/styles/styles";
import Header from "@/components/Header";
import Body from "@/components/Body";
import {checkOpGen, handlePressGen} from "@/logic/checkOperation";
import debugOptions_ from "@/logic/debugOptions";
import {Debug} from "@/scripts/debug";

const Calculator = () => {
    const [ sound, _, setSound ] = useStateStorage<Audio.Sound | null>(null);
    const [ experience, getExperience, setExperience ] = useStateStorage<number>(0, 'experience');
    const [ minValue, getMinValue, setMinValue ] = useStateStorage<number>(0, 'minValue');
    const [ maxValue, getMaxValue, setMaxValue ] = useStateStorage<number>(0, 'maxValue');
    const [ unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons ] = useStateStorage<IconDefinition[]>([faPlus], 'unlockedOperationIcons');
    const [ solvedOperations, getSolvedOperations, setSolvedOperations ] = useStateStorage<Operation[]>([], 'solvedOperations');
    const [ capInfinity, getCapInfinity, setCapInfinity ] = useStateStorage<boolean>(false, 'capInfinity');
    const [ unlockedSpecials, getUnlockedSpecials, setUnlockedSpecials ] = useStateStorage<('infinity'|'negatives')[]>([], 'unlockedSpecials');

    const generateNewOperation = genOpGen(solvedOperations, getMinValue, getMaxValue, getUnlockedOperationIcons);

    const [ currentOperation, getCurrentOperation, setCurrentOperation ] = useStateStorage<Operation>(generateNewOperation());
    const [ inputValue, getInputValue, setInputValue ] = useStateStorage<string>('');
    const [ pass, getPass, setPass ] = useStateStorage<boolean>(false);

    let explosion: Confetti | null;
    const colorScheme = useColorScheme();
    const themeColor = useThemeColor({}, 'background');
    const debugOptions = debugOptions_(setExperience, setMinValue, setMaxValue, setUnlockedOperationIcons, setSolvedOperations, getCurrentOperation, setCurrentOperation, setCapInfinity);
    const checkOperation = checkOpGen(setSound, getInputValue, setInputValue, getCurrentOperation, calculateResult, setExperience, getExperience, setSolvedOperations, getSolvedOperations, getUnlockedSpecials, setUnlockedSpecials, setMaxValue, getMaxValue, setCurrentOperation, generateNewOperation, setCapInfinity, getCapInfinity, setUnlockedOperationIcons, getUnlockedOperationIcons, setPass, () => explosion);
    const handlePress = handlePressGen(setSound, getInputValue, setInputValue, getCurrentOperation, calculateResult, checkOperation, setPass, getPass);

    useEffect(() => {
        // Example: Set the initial operation or fetch data if needed
        setCurrentOperation(generateNewOperation());
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: themeColor }]}>
            <Header experience={experience} debugOptions={debugOptions} />
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
};

export default Calculator;
