// Grid.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import styles from "@/styles/styles";
import {faInfinity, faPlusMinus} from "@fortawesome/free-solid-svg-icons";
// import {Audio} from "expo-av";

interface GridProps {
    items: Array<IconDefinition>;
    onPress: (item: IconDefinition | 'capInfinity') => void;
    capInfinity?: boolean;
}

const Grid: React.FC<GridProps> = ({ items, onPress, capInfinity }) => (
    <>
        {items.map((item, index) => (
            <View key={index} style={styles.gridItem}>
                <TouchableOpacity onPress={() => onPress(item.iconName === '5' && capInfinity ? 'capInfinity' : item)} style={styles.calcButton}>
                    {
                        item.iconName === '5' && capInfinity
                        ? <>
                            <FontAwesomeIcon icon={faPlusMinus} style={styles.calcText} />
                            <FontAwesomeIcon icon={faInfinity} style={styles.calcText} />
                        </>
                        : <FontAwesomeIcon icon={item} style={styles.calcText} />
                    }
                </TouchableOpacity>
            </View>
        ))}
    </>
);

export default Grid;
