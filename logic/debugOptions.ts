import {faDivide, faPlus} from "@fortawesome/free-solid-svg-icons";

export default function (
    setExperience: (experience: number) => void,
    setMinValue: (minValue: number) => void,
    setMaxValue: (maxValue: number) => void,
    setUnlockedOperationIcons: (unlockedOperationIcons: any[]) => void,
    setSolvedOperations: (solvedOperations: any[]) => void,
    getCurrentOperation: () => any,
    setCurrentOperation: (currentOperation: any) => void,
    setCapInfinity: (capInfinity: boolean) => void
) {
    return {
        wipeData: () => {
            setExperience(0);
            setMinValue(0);
            setMaxValue(0);
            setUnlockedOperationIcons([faPlus]);
            setSolvedOperations([]);
        },
        divideByZero: () => {
            const currentOperation = getCurrentOperation();
            currentOperation.bValue = 0;
            currentOperation.operationIcon = faDivide;
            setCurrentOperation(currentOperation);
            setCapInfinity(true);
        },
    }
}