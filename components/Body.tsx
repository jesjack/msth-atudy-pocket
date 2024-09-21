import {Operation} from "@/interfaces/Operation";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {TextInput, View} from "react-native";
import styles from "@/styles/styles";
import OperationDisplay from "@/components/OperationDisplay";
import CalcButton from "@/components/CalcButton";
import {faArrowLeft, faArrowsSpin, faEquals, faHandshake} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Grid from "@/components/Grid";
import {rows} from "@/constants/constants";
import {SemiNumberToIcons} from "@/components/NumberToIcons";

export default ({
    checkOperation,
    handlePress,
    useOperationManagement
                }: {
    checkOperation: () => Promise<void> | undefined,
    handlePress: (icon: IconDefinition | 'capInfinity') => void,
    useOperationManagement: ReturnType<typeof import('@/hooks/useOperationManagement').default>
}) => {
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
        generateNewOperation
    } = useOperationManagement;

    return (
        <View style={styles.body}>
            <View style={styles.layout1}>
                <View style={styles.question}>
                    <OperationDisplay {...currentOperation} />
                    <CalcButton icon={faArrowsSpin} onPress={() => setCurrentOperation(generateNewOperation())} style={styles.returnButton}/>
                </View>
                <View style={styles.result}>
                    <FontAwesomeIcon icon={faEquals}/>
                    {/*<TextInput*/}
                    {/*    style={styles.numberInput}*/}
                    {/*    keyboardType="numeric"*/}
                    {/*    value={inputValue}*/}
                    {/*    onChangeText={(value) => setInputValue(value)}*/}
                    {/*/>*/}
                    <SemiNumberToIcons number={inputValue} size={30} style={{ flex: 1 }} />
                    <CalcButton icon={faArrowLeft} onPress={() => setInputValue(inputValue.slice(0, -1))}
                                style={styles.returnButton}/>
                </View>
                <CalcButton icon={faHandshake} onPress={checkOperation} style={styles.resultButton}/>
            </View>
            <View style={styles.layout2}>
                {rows.map((row, index) => (
                    <View key={index} style={styles.l2Row}>
                        <Grid items={row} onPress={handlePress} capInfinity={capInfinity}/>
                    </View>
                ))}
            </View>
        </View>
    )
};