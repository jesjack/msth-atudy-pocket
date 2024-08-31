import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
    faE, faPlus
} from '@fortawesome/free-solid-svg-icons';

const NumberToIcons = ({number}: {number: number}) => {
    const numberString = number.toString();
    const icons = numberString.split('').map((char, index) => <FontAwesomeIcon icon={{
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
    }[char] ?? fa0} key={index}/>);

    return (
        <View style={styles.container}>
            {icons}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default NumberToIcons;