import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Operation } from '@/interfaces/Operation';
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import NumberToIcons from "@/components/NumberToIcons";

const OperationDisplay: React.FC<Operation> = ({ aValue, bValue, operationIcon }: {
    aValue: number;
    bValue: number;
    operationIcon: IconDefinition;
}) => {
    // console.log(aValue, bValue, operationIcon);
    return (
        <View style={styles.container}>
            <NumberToIcons number={aValue} size={30} />
            {/*<Text style={styles.largeText}>{aValue}</Text>*/}
            <FontAwesomeIcon icon={operationIcon} />
            {/*<Text style={styles.largeText}>{bValue}</Text>*/}
            <NumberToIcons number={bValue} size={30} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    largeText: {
        fontSize: 40,
    },
});

export default OperationDisplay;
