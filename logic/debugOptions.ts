import {faDivide, faPlus} from "@fortawesome/free-solid-svg-icons";
import useOperationManagement from "@/hooks/useOperationManagement";

export default function (useOperationManagement_: ReturnType<typeof useOperationManagement>) {
    const {
        setExperience,
        setMinValue,
        setMaxValue,
        setUnlockedOperationIcons,
        setSolvedOperations,
        setCapInfinity,
        getCurrentOperation, setCurrentOperation,
        setUnlockedAchievements,
    } = useOperationManagement_;

    return {
        wipeData: () => {
            setExperience(0);
            setMinValue(0);
            setMaxValue(0);
            setUnlockedOperationIcons([faPlus]);
            setSolvedOperations([]);
            setUnlockedAchievements([]);
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