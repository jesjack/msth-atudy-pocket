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

export default ({ currentOperation, inputValue, setInputValue, checkOperation, handlePress, generateNewOperation, capInfinity }: {
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
            ))}
        </View>
    </View>
);