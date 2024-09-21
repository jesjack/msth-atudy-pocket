import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faBug, faCarrot, faDivide, faEgg, faInfinity, faMinus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {calculateResult} from "@/logic/calculatorLogic";

type validationFunction = (args: ReturnType<typeof import('@/hooks/useOperationManagement').default>) => boolean;

export class Achievement {
    id: number;
    name: string;
    description: string;
    icon: IconDefinition;
    validationFunction: validationFunction;

    constructor(id: number, name: string, description: string, icon: IconDefinition, validationFunction: validationFunction) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.validationFunction = validationFunction;
    }
}

export const achievements = [
    new Achievement(0, 'Primer paso', 'Resuelve tu primera operación', faEgg,
        ({
             solvedOperations
         }) => {
            return solvedOperations.length > 0;
        }),
    new Achievement(1, 'Resta primigenia', 'Resuelve una operación de resta', faMinus,
        ({
             solvedOperations
         }) => {
            return solvedOperations.some(op => op.operationIcon.iconName === 'minus');
        }),
    new Achievement(2, 'Suma de sumas', 'Resuelve una multiplicación', faXmark,
        ({
             solvedOperations
         }) => {
            return solvedOperations.some(op => op.operationIcon.iconName === 'xmark');
        }),
    new Achievement(3, 'Entrando a terreno peligroso', 'Resuelve una división', faDivide,
        ({
             solvedOperations
         }) => {
            return solvedOperations.some(op => op.operationIcon.iconName === 'divide');
        }),
    new Achievement(4, 'Como conejos', 'Realiza 100 multiplicaciones', faCarrot,
        ({
             solvedOperations
         }) => {
            return solvedOperations.filter(op => op.operationIcon.iconName === 'xmark').length >= 100;
        }),
    new Achievement(5, 'Infinito Gorrito', 'Divide entre cero', faInfinity,
        ({
             solvedOperations
         }) => {
            return solvedOperations.some(op => op.bValue === 0 && op.operationIcon.iconName === 'divide');
        }),
    new Achievement(6, 'La cosa se pone seria', 'Conseguiste 100 puntos de experiencia y desbloqueaste la resta', faMinus,
        ({
             getExperience,
             setUnlockedOperationIcons,
             getUnlockedOperationIcons
         }) => {
            if (getExperience() < 100) {
                return false;
            }
            setUnlockedOperationIcons([...getUnlockedOperationIcons(), faMinus]);
            return true;
        }),
    new Achievement(7, 'Multiples dimensiones', 'Conseguiste 1000 puntos de experiencia y desbloqueaste la multiplicación', faXmark,
        ({
             getExperience,
             setUnlockedOperationIcons,
             getUnlockedOperationIcons
         }) => {
            if (getExperience() < 1000) {
                return false;
            }
            setUnlockedOperationIcons([...getUnlockedOperationIcons(), faXmark]);
            return true;
        }),
    new Achievement(8, 'No siempre uno', 'Conseguiste 3000 puntos de experiencia y desbloqueaste la división', faDivide,
        ({
             getExperience,
             setUnlockedOperationIcons,
             getUnlockedOperationIcons
         }) => {
            if (getExperience() < 3000) {
                return false;
            }
            setUnlockedOperationIcons([...getUnlockedOperationIcons(), faDivide]);
            return true;
        }),
    new Achievement(9, 'No siempre crece', 'Resuelve 100 restas', faMinus,
        ({ solvedOperations }) => solvedOperations.filter(op => op.operationIcon.iconName === 'minus').length >= 100),
    new Achievement(10, '¿10 infinitos no son suficientes?', 'Resuelve 10 operaciones con infinito', faInfinity,
        ({ solvedOperations }) => solvedOperations.filter(op => op.aValue === Infinity || op.bValue === Infinity).length >= 10),
    new Achievement(-1, 'logic', 'Logica tras resolver una operación', faBug
        , ({
            getUnlockedAchievements,
            getCurrentOperation,
            setMinValue,
            getMinValue
           }) => {

            const logics = new Map<number, () => void>();
            logics.set(9, () => {
                if (getCurrentOperation().operationIcon.iconName === 'minus') {
                    setMinValue(getMinValue() - 1);
                }
                const result = calculateResult(getCurrentOperation());
                if (result.value < 0) {
                    setMinValue(getMinValue() - 1);
                }
            });

            getUnlockedAchievements().forEach(achievementId => logics.get(achievementId)?.());

            return false;
        })
];