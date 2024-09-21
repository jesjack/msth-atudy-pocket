import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCircleDot,
    faMinus,
    fa0,
    fa1,
    fa2,
    fa3,
    fa4,
    fa5,
    fa6,
    fa7,
    fa8,
    fa9,
    faE, faPlus, faPlusMinus, faInfinity
} from '@fortawesome/free-solid-svg-icons';
import NamedStyles = StyleSheet.NamedStyles;

interface NumberToIconsProps {
    number: number;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

const NumberToIcons = ({number, size, style}: NumberToIconsProps) => {
    const numberString = number.toString();
    const icons = numberString.split('').map((char, index) =>
        <FontAwesomeIcon icon={{
            '0': fa0,
            '1': fa1,
            '2': fa2,
            '3': fa3,
            '4': fa4,
            '5': fa5,
            '6': fa6,
            '7': fa7,
            '8': fa8,
            '9': fa9,
            '.': faCircleDot,
            '-': faMinus,
            '+': faPlus,
            'e': faE,
        }[char] ?? fa0}
                         size={size}
                         key={index}/>);

    return (
        <View style={[styles.container, style]}>
            {icons}
        </View>
    );
}

interface SemiNumberToIconsProps extends Omit<NumberToIconsProps, 'number'> {
    number: string; // Redefinir como string
}

export const SemiNumberToIcons = ({number, size, style}: SemiNumberToIconsProps) => {
    const icons = number.split('').map((char, index) =>
        <FontAwesomeIcon icon={{
            '0': fa0,
            '1': fa1,
            '2': fa2,
            '3': fa3,
            '4': fa4,
            '5': fa5,
            '6': fa6,
            '7': fa7,
            '8': fa8,
            '9': fa9,
            '.': faCircleDot,
            '-': faMinus,
            '+': faPlus,
            'e': faE,
            '±': faPlusMinus,
            '∞': faInfinity,
        }[char] ?? fa0}
                         size={size}
                         key={index}/>);

    return (
        <View style={[styles.container, style]}>
            {icons}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default NumberToIcons;