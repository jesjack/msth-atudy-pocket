import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface CalcButtonProps {
    icon: IconDefinition;
    onPress: () => void;
    style?: object;
}

const CalcButton: React.FC<CalcButtonProps> = ({ icon, onPress, style = {} }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <FontAwesomeIcon icon={icon} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CalcButton;
