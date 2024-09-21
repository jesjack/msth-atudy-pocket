import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Animated, TouchableWithoutFeedback, StyleSheet, ScrollView, Button } from 'react-native';

interface DynamicModalProps {
    visible: boolean;
    onClose?: () => void;
    closeOnPressOutside?: boolean;
    children: React.ReactNode;
}

const DynamicModal: React.FC<DynamicModalProps> = ({ visible, onClose, closeOnPressOutside = true, children }) => {
    const [modalVisible, setModalVisible] = useState(visible);
    const scaleValue = useState(new Animated.Value(0))[0];

    // Escucha el prop visible para abrir o cerrar el modal
    useEffect(() => {
        if (visible) {
            openModal();
        } else {
            closeModal();
        }
    }, [visible]);

    const openModal = () => {
        setModalVisible(true);
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 50,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(scaleValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            if (onClose) {
                onClose();
            }
        });
    };

    const handleOutsidePress = () => {
        if (closeOnPressOutside) {
            closeModal();
        }
    };

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            animationType="none"
            onRequestClose={handleOutsidePress} // Cierra en Android con botón atrás
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                {children}
                            </ScrollView>
                            {/* Botón opcional para cerrar el modal */}
                            {/* <Button title="Cerrar Modal" onPress={closeModal} /> */}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%', // Altura máxima del modal
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
});

export default DynamicModal;

export const DynamicModal1: (
    closable?: boolean,
) => [pop: (children: React.ReactNode) => void, modal: React.ReactNode] = (
    closable = true,
) => {
    const [modal, setModal] = useState<React.ReactNode>(null);

    const pop = (children: React.ReactNode) => {
        setModal(
            <DynamicModal visible={true} onClose={() => setModal(null)} closeOnPressOutside={closable}>
                {children}
            </DynamicModal>,
        );
    };

    return [pop, modal];
};
