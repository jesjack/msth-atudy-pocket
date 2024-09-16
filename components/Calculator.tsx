// Calculator.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {useColorScheme} from "@/hooks/useColorScheme";
import {useThemeColor} from "@/hooks/useThemeColor";
import Confetti from "react-native-confetti";
import Toast from "react-native-toast-message";
import styles from "@/styles/styles";
import Header from "@/components/Header";
import Body from "@/components/Body";
import {checkOpGen, handlePressGen} from "@/logic/checkOperation";
import debugOptions_ from "@/logic/debugOptions";
import {Debug} from "@/scripts/debug";
import useOperationManagement from "@/hooks/useOperationManagement";

const Calculator = () => {
    const {
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
    } = useOperationManagement();

    const colorScheme = useColorScheme();
    const themeColor = useThemeColor({}, 'background');
    const debugOptions = debugOptions_();
    const checkOperation = checkOpGen();
    const handlePress = handlePressGen(checkOperation);

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
            <Confetti ref={ref => setExplosion(ref)} duration={1000} confettiCount={20} timeout={1} />
            <Debug />
            <Toast />
        </View>
    );
};

export default Calculator;
