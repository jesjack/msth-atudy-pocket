import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useStateStorage<T>(initialValue: T, saveInStorage: false | string = false): [T, () => T, (newValue: T) => void] {
    const [state, setState] = useState<T>(initialValue);
    const valueRef = useRef(initialValue);

    useEffect(() => {
        if (saveInStorage) {
            AsyncStorage.getItem(saveInStorage).then((data) => {
                if (data) {
                    const parsedData = JSON.parse(data);
                    setState(parsedData);
                    valueRef.current = parsedData;
                }
            });
        }
    }, [saveInStorage]);

    const setValue = (newValue: T) => {
        setState(newValue);
        valueRef.current = newValue;
        if (saveInStorage) {
            AsyncStorage.setItem(saveInStorage, JSON.stringify(newValue));
        }
    };

    const getValue = () => valueRef.current;

    return [state, getValue, setValue];
}

export default useStateStorage;
