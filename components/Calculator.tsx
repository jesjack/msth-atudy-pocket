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
    const operationManagement = useOperationManagement();

    const {
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
    } = operationManagement;

    const colorScheme = useColorScheme();
    const themeColor = useThemeColor({}, 'background');
    const debugOptions = debugOptions_(operationManagement);
    const checkOperation = checkOpGen(operationManagement);
    const handlePress = handlePressGen(checkOperation, operationManagement);

    return (
        <View style={[styles.container, { backgroundColor: themeColor }]}>
            <Header experience={experience} debugOptions={debugOptions} achievements={unlockedAchievements} />
            <Body
                checkOperation={checkOperation}
                handlePress={handlePress}
                useOperationManagement={operationManagement}
            />
            <Confetti ref={ref => setExplosion(ref)} duration={1000} confettiCount={20} timeout={1} />
            <Debug />
            <Toast />
        </View>
    );
};

export default Calculator;
