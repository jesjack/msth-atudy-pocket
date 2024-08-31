import { useState, useEffect, useRef, useCallback } from 'react';

function useStateWithPromise<T>(initialValue: T, setterFunction: (value: T) => Promise<void>): [T, (value: T) => Promise<T>] {
    const [state, setState] = useState<T>(initialValue);
    const resolverRef = useRef<(value: T) => void>();

    useEffect(() => {
        if (resolverRef.current) {
            resolverRef.current(state);
            resolverRef.current = undefined;
        }
    }, [state]);

    const setStateAsync = useCallback((value: T): Promise<T> => {
        setState(value);
        return new Promise<T>((resolve) => {
            resolverRef.current = resolve;
        });
    }, []);

    return [state, async(v: T) => {
        await setStateAsync(v);
        await setterFunction(v);
        return v;
    }];
}

export default useStateWithPromise;