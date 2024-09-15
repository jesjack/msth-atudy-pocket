// calculatorLogic.ts
import { Operation } from "@/interfaces/Operation";

export const calculateResult = (operation: Operation) => {
    const { aValue, bValue, operationIcon } = operation;
    switch (operationIcon.iconName) {
        case 'plus':
            return { value: aValue + bValue, xp: aValue.toString().length + bValue.toString().length + (aValue + bValue).toString().length };
        case 'minus':
            return { value: aValue - bValue, xp: (aValue.toString().length + bValue.toString().length + (aValue + bValue).toString().length) * 2 };
        case 'xmark':
            return { value: aValue * bValue, xp: 10 };
        case 'divide':
            return { value: aValue / bValue, xp: (aValue / bValue).toString().length * 20 };
        default:
            return { value: 0, xp: 0 };
    }
};
