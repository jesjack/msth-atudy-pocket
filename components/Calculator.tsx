// Calculator.tsx
import React, {useState as useState__, useEffect, SetStateAction} from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9,
    faArrowLeft, faArrowsSpin, faBrain, faCircleDot, faDivide,
    faEquals, faHandshake, faMinus, faPlus, faToilet, faXmark
} from "@fortawesome/free-solid-svg-icons";
import Grid from "@/components/Grid";
import NumberToIcons from "@/components/NumberToIcons";
import styles from "@/styles/styles";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import CalcButton from "@/components/CalcButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import OperationDisplay from "@/components/OperationDisplay";
import {Operation} from "@/interfaces/Operation";
import useStateWithPromise from "@/interfaces/UseState";

const rows = [
    [fa7, fa8, fa9],
    [fa4, fa5, fa6],
    [fa1, fa2, fa3],
    [faCircleDot, fa0, faMinus],
];

const operationIcons = [faPlus, faMinus, faXmark, faDivide];

const defOperation: Operation = {
    aValue: 0,
    bValue: 0,
    operationIcon: faPlus,
};

const waitingFunctions: (() => void)[] = [];

export default function Calculator() {
    const useState = <T extends unknown>(initialValue: T, setterFunction: (value: T) => Promise<void>): [T, (value: T) => void] => {
        const [state, setState] = useState__<T>(initialValue);
        return [state, (v: T) => {
            setterFunction(v).then(r => r);
            setState(v)
            console.log('state', state, v);
        }];
    };

    const [experience, setExperienceState] = useStateWithPromise<number>(0, setExperience);
    const [minValue, setMinValueState] = useStateWithPromise<number>(0, setMinValue);
    const [maxValue, setMaxValueState] = useStateWithPromise<number>(0, setMaxValue);
    const [unlockedOperationIcons, setUnlockedOperationIconsState] = useStateWithPromise<IconDefinition[]>([faPlus], setUnlockedOperationIcons);
    const [currentOperation, setCurrentOperationState] = useStateWithPromise<Operation>(defOperation, setCurrentOperation);
    const [solvedOperations, setSolvedOperationsState] = useStateWithPromise<Operation[]>([], setSolvedOperations);
    const [inputValue, setInputValue] = useState__('');

    const addExperience = (value: number) => setExperienceState(experience + value);
    const subtractExperience = (value: number) => setExperienceState(experience - value);
    const addSolvedOperation = (operation: Operation) => setSolvedOperationsState([...solvedOperations, operation]);
    const newOperation = (v: [Operation[], number]) => {
        const [solvedOperations, maxValue] = v;
        console.log('newOperation', solvedOperations);
        let operationIcon = unlockedOperationIcons[Math.floor(Math.random() * unlockedOperationIcons.length)];
        let aValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        let bValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        while (solvedOperations.some(op => op.aValue === aValue && op.bValue === bValue && op.operationIcon.iconName === operationIcon.iconName)) {
            operationIcon = unlockedOperationIcons[Math.floor(Math.random() * unlockedOperationIcons.length)];
            aValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
            bValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        }
        setCurrentOperationState({ aValue, bValue, operationIcon }).then(v => v);
    };
    const checkOperation = () => {
        const aVal = currentOperation.aValue;
        const bVal = currentOperation.bValue;
        const op = {
            [faPlus.iconName]: {
                val: aVal + bVal,
                xp: aVal + bVal,
            },
            [faMinus.iconName]: {
                val: aVal - bVal,
                xp: aVal + bVal*2,
            },
            [faXmark.iconName]: {
                val: aVal * bVal,
                xp: Math.min(aVal, bVal)*2 + Math.max(aVal, bVal)*3,
            },
            [faDivide.iconName]: {
                val: aVal / bVal,
                xp: Math.min(aVal, bVal)*4 + Math.max(aVal, bVal)*5
            },
        }[currentOperation.operationIcon.iconName];
        if (parseFloat(inputValue) === op.val) {
            addExperience(op.xp).then(v => v);
            Promise.all([
                addSolvedOperation(currentOperation),
                setMaxValueState(maxValue + 1),
            ])
            .then(v => newOperation(v));
            setInputValue('');
        } else {
            subtractExperience(5).then(v => v);
        }
    };
    const wipeData = async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error(e);
        }
        setExperienceState(0).then(v => v);
        setUnlockedOperationIconsState([faPlus]).then(v => v);
        setCurrentOperationState(defOperation).then(v => v);
        setSolvedOperationsState([]).then(v => v);
    };

    useEffect(() => {
        const f: Map<(v: SetStateAction<any>) => void, () => Promise<any>> = new Map();
        f.set(setExperienceState, getExperience);
        f.set(setUnlockedOperationIconsState, getUnlockedOperationIcons);
        f.set(setCurrentOperationState, getCurrentOperation);
        f.set(setMinValueState, getMinValue);
        f.set(setMaxValueState, getMaxValue);
        f.set(setSolvedOperationsState, getSolvedOperations);
        f.forEach((fetch, set) => fetch().then(set));
    }, []);

    const handlePress = (item: IconDefinition) => {
        const symbol = item.iconName === 'minus' ? '-' : item.iconName === 'circle-dot' ? '.' : item.iconName;
        setInputValue(prev => prev + symbol);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <FontAwesomeIcon icon={faBrain} />
                <NumberToIcons number={experience} />
                <CalcButton icon={faToilet} onPress={wipeData} style={styles.returnButton} />
            </View>
            <View style={styles.body}>
                <View style={styles.layout1}>
                    <View style={styles.question}>
                        <OperationDisplay {...currentOperation} />
                        <CalcButton icon={faArrowsSpin} onPress={() => newOperation([solvedOperations, maxValue])} style={styles.returnButton} />
                    </View>
                    <View style={styles.result}>
                        <FontAwesomeIcon icon={faEquals} />
                        <TextInput
                            style={styles.numberInput}
                            keyboardType="numeric"
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <CalcButton icon={faArrowLeft} onPress={() => setInputValue(inputValue.slice(0, -1))} style={styles.returnButton} />
                    </View>
                    <CalcButton icon={faHandshake} onPress={checkOperation} style={styles.resultButton} />
                </View>
                <View style={styles.layout2}>
                    {rows.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.l2Row}>
                            <Grid items={row} onPress={handlePress} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const getExperience = async () => {
    try {
        const value = await AsyncStorage.getItem('lvl');
        if (value !== null) {
            return parseInt(value, 10);
        }
        return 0; // Default value if not set
    } catch (e) {
        console.error(e);
        return 0;
    }
};

const setExperience = async (lvl: number) => {
    try {
        await AsyncStorage.setItem('lvl', lvl.toString());
    } catch (e) {
        console.error(e);
    }
};

const getUnlockedOperationIcons: () => Promise<IconDefinition[]> = async () => {
    try {
        const value = await AsyncStorage.getItem('unlockedOperationIcons');
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.error(e);
    }
    return [faPlus];
};

const setUnlockedOperationIcons = async (operations: IconDefinition[]) => {
    try {
        await AsyncStorage.setItem('unlockedOperationIcons', JSON.stringify(operations));
    } catch (e) {
        console.error(e);
    }
};

const getCurrentOperation: () => Promise<Operation> = async () => {
    try {
        const value = await AsyncStorage.getItem('currentOperation');
        if (value !== null)
            return JSON.parse(value);
    } catch (e) {
        console.error(e);
    }
    return defOperation;
};

const setCurrentOperation = async (operation: Operation) => {
    try {
        await AsyncStorage.setItem('currentOperation', JSON.stringify(operation));
    } catch (e) {
        console.error(e);
    }
};

const getMinValue = async () => {
    try {
        const value = await AsyncStorage.getItem('minValue');
        if (value !== null)
            return parseInt(value, 10);
    } catch (e) {
        console.error(e);
    }
    return 0;
};

const setMinValue = async (value: number) => {
    try {
        await AsyncStorage.setItem('minValue', value.toString());
    } catch (e) {
        console.error(e);
    }
};

const getMaxValue = async () => {
    try {
        const value = await AsyncStorage.getItem('maxValue');
        if (value !== null)
            return parseInt(value, 10);
    } catch (e) {
        console.error(e);
    }
    return 0;
};

const setMaxValue = async (value: number) => {
    try {
        await AsyncStorage.setItem('maxValue', value.toString());
    } catch (e) {
        console.error(e);
    }
};

const getSolvedOperations = async () => {
    try {
        const value = await AsyncStorage.getItem('solvedOperations');
        if (value !== null)
            return JSON.parse(value);
    } catch (e) {
        console.error(e);
    }
    return [];
};

const setSolvedOperations = async (operations: Operation[]) => {
    try {
        await AsyncStorage.setItem('solvedOperations', JSON.stringify(operations));
    } catch (e) {
        console.error(e);
    }
};