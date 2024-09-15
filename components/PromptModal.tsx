import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface PromptModalProps {
    visible: boolean;
    onClose: (value: string) => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ visible, onClose }) => {
    const [inputValue, setInputValue] = useState('');

    const handleCancel = () => {
        setInputValue('');
        onClose('');
    };

    const handleSubmit = () => {
        onClose(inputValue);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Enter Value</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type something"
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                    <View style={styles.buttonsContainer}>
                        <Button title="Cancel" onPress={handleCancel} />
                        <Button title="Submit" onPress={handleSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default PromptModal;
