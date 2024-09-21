import useGenOpParams_ from "@/hooks/useGenOpParams";
import {Operation} from "@/interfaces/Operation";

function getNumberFrequencies(operations: Operation[]): Map<number, number> {
    const frequencyMap = new Map<number, number>();

    operations.forEach(({ aValue, bValue }) => {
        frequencyMap.set(aValue, (frequencyMap.get(aValue) || 0) + 1);
        frequencyMap.set(bValue, (frequencyMap.get(bValue) || 0) + 1);
    });

    return frequencyMap;
}


export function genOpGen(useGenOpParams: ReturnType<typeof useGenOpParams_>) {
    const {
        solvedOperations,
        getUnlockedOperationIcons,
        getMinValue,
        getMaxValue,
        getUnlockedAchievements
    } = useGenOpParams;

    function generateWeightedNumber(min: number, max: number, frequencyMap: Map<number, number>): number {
        const numbers: number[] = [];

        for (let i = min; i <= max; i++) {
            const frequency = frequencyMap.get(i) || 0;
            const weight = 1 / (frequency + 1); // A mayor frecuencia, menor el peso
            const entries = Array(Math.floor(weight * 100)).fill(i); // Crear más entradas para números menos frecuentes
            numbers.push(...entries);
        }

        // el logro 5 permite la aparición de infinito
        if (getUnlockedAchievements().includes(5)) {
            const frequency = frequencyMap.get(Infinity) || 0;
            const weight = 1 / (frequency + 1);
            const entries = Array(Math.floor(weight * 100)).fill(Infinity);
            numbers.push(...entries);
        }

        // el 10 el de -infinito
        if (getUnlockedAchievements().includes(10)) {
            const frequency = frequencyMap.get(-Infinity) || 0;
            const weight = 1 / (frequency + 1);
            const entries = Array(Math.floor(weight * 100)).fill(-Infinity);
            numbers.push(...entries);
        }

        return numbers[Math.floor(Math.random() * numbers.length)];
    }

    return function generateNewOperation() {
        const frequencyMap = getNumberFrequencies(solvedOperations);
        const minValue = getMinValue();
        const maxValue = getMaxValue();

        let operation!: Operation;
        let unique = false;

        while (!unique) {
            let aValue = generateWeightedNumber(minValue, maxValue, frequencyMap);
            let bValue = generateWeightedNumber(minValue, maxValue, frequencyMap);
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
                if (bValue === 0) continue; // Evitar divisiones por cero
            }

            operation = { aValue, bValue, operationIcon };

            // Verificar si la operación ya ha sido resuelta
            unique = !solvedOperations.some(op =>
                op.aValue === operation.aValue &&
                op.bValue === operation.bValue &&
                op.operationIcon.iconName === operation.operationIcon.iconName
            );
        }

        return operation;
    }

}
