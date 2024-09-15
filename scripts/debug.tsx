import React, { useState } from 'react';
import { View, Button } from 'react-native';
import PromptModal from "@/components/PromptModal";

// Una función para manejar el estado del modal y la promesa
let openPrompt: (DO: debugOptions) => Promise<string>;

const Debug = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [resolvePromise, setResolvePromise] = useState<((value: string) => void) | null>(null);
    const [value, setValue] = useState<string | null>(null);
    const [debugOptions, setDebugOptions] = useState<debugOptions | null>(null);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = (inputValue: string) => {
        setModalVisible(false);
        setValue(inputValue);
        if (resolvePromise) {
            resolvePromise(inputValue);
        }
        if (debugOptions && inputValue === 'wipe') {
            debugOptions.wipeData();
        }
        if (debugOptions && inputValue === 'divide') {
            debugOptions.divideByZero();
        }
    };

    // Exponer la función para abrir el modal y manejar la promesa
    openPrompt = (debugOptions) => {
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
            handleOpenModal();
            setDebugOptions(debugOptions);
        });
    };

    return (
        <View>
            <PromptModal visible={modalVisible} onClose={handleCloseModal} />
        </View>
    );
};

interface debugOptions {
    wipeData: () => void;
    divideByZero: () => void;
}

export { Debug, openPrompt, debugOptions };
