// Grid.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import styles from "@/styles/styles";

interface GridProps {
    items: Array<IconDefinition>;
    onPress: (item: IconDefinition) => void;
}

const Grid: React.FC<GridProps> = ({ items, onPress }) => (
    <>
        {items.map((item, index) => (
            <View key={index} style={styles.gridItem}>
                <TouchableOpacity onPress={() => onPress(item)} style={styles.calcButton}>
                    <FontAwesomeIcon icon={item} style={styles.calcText} />
                </TouchableOpacity>
            </View>
        ))}
    </>
);

export default Grid;
