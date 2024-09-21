import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { achievements } from "@/constants/achievements"; // Reemplaza con la ruta correcta

interface AchievementItemProps {
    id: number;
    name: string;
    description: string;
    icon: IconDefinition;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ id, name, description, icon }) => {
    return (
        <View style={styles.achievementCard}>
            {/* Contenedor interno con padding */}
            <View style={styles.contentContainer}>
                <FontAwesomeIcon icon={icon} size={25} style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.achievementName}>{name}</Text>
                    <Text style={styles.achievementDescription}>{description}</Text>
                </View>
            </View>
        </View>
    );
};

const AchievementsList: React.FC<{ unlockedAchievements: number[] }> = ({ unlockedAchievements }) => {
    const unlocked = achievements
        .filter(achievement => unlockedAchievements.includes(achievement.id))
        .sort((a, b) => unlockedAchievements.indexOf(a.id) - unlockedAchievements.indexOf(b.id));

    return (
        <View style={styles.container}>
            <ScrollView>
                {unlocked.map(item => (
                    <AchievementItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        icon={item.icon}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    achievementCard: {
        position: 'relative',
        borderRadius: 10,
        marginBottom: 15,
        elevation: 4, // sombra en Android
        shadowColor: '#000', // sombra en iOS
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: 'hidden', // para que el gradiente no se salga de los bordes
        width: '100%',
    },
    contentContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        padding: 15, // Aquí aplicamos el padding solo al contenido
        zIndex: 1, // Asegura que el contenido esté por encima del gradiente
        backgroundColor: 'black',
    },
    icon: {
        color: '#fff',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    achievementName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    achievementDescription: {
        fontSize: 14,
        color: '#fff',
    },
});

export default AchievementsList;
