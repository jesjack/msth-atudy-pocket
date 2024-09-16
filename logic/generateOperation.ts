import useGenOpParams from "@/hooks/useGenOpParams";

export function genOpGen() {
    const {
        solvedOperations,
        getUnlockedOperationIcons,
        getMinValue,
        getMaxValue
    } = useGenOpParams();

    return function generateNewOperation() {
        let aValue = Math.floor(Math.random() * (getMaxValue() - getMinValue() + 1) + getMinValue());
        let bValue = Math.floor(Math.random() * (getMaxValue() - getMinValue() + 1) + getMinValue());
        let operationIcon = getUnlockedOperationIcons()[Math.floor(Math.random() * getUnlockedOperationIcons().length)];
        if (operationIcon.iconName === 'minus') {
            aValue = Math.floor(aValue / 3);
            bValue = Math.floor(bValue / 3);
        }
        if (operationIcon.iconName === 'xmark') {
            aValue = Math.floor(aValue / 7);
            bValue = Math.floor(bValue / 7);
        }
        if (operationIcon.iconName === 'divide') {
            aValue = Math.floor(aValue / 15);
            bValue = Math.floor(bValue / 15);
        }
        let operation = { aValue, bValue, operationIcon };
        while (solvedOperations.some(op => op.aValue === operation.aValue && op.bValue === operation.bValue && op.operationIcon.iconName === operation.operationIcon.iconName)) {
            operation = generateNewOperation();
        }
        return operation;
    };
}