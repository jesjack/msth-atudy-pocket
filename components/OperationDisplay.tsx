import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Operation } from '@/interfaces/Operation';

const OperationDisplay: React.FC<Operation> = ({ aValue, bValue, operationIcon }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.largeText}>{aValue}</Text>
            <FontAwesomeIcon icon={operationIcon} />
            <Text style={styles.largeText}>{bValue}</Text>
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
