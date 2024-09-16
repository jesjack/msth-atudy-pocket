import {faDivide, faPlus} from "@fortawesome/free-solid-svg-icons";
import useOperationManagement from "@/hooks/useOperationManagement";

export default function () {
    const {
        setExperience,
        setMinValue,
        setMaxValue,
        setUnlockedOperationIcons,
        setSolvedOperations,
        setCapInfinity,
        getCurrentOperation, setCurrentOperation
    } = useOperationManagement();

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