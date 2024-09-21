// useGenOpParams.ts
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Operation } from '@/interfaces/Operation';
import useStateStorage from "@/interfaces/UseState";
import {faPlus} from "@fortawesome/free-solid-svg-icons"; // Ajusta la ruta según tu proyecto

const useGenOpParams = () => {
    const [ minValue, getMinValue, setMinValue ] = useStateStorage<number>(0, 'minValue');
    const [ maxValue, getMaxValue, setMaxValue ] = useStateStorage<number>(0, 'maxValue');
    const [ unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons ] = useStateStorage<IconDefinition[]>([faPlus], 'unlockedOperationIcons');
    const [ solvedOperations, getSolvedOperations, setSolvedOperations ] = useStateStorage<Operation[]>([], 'solvedOperations');
    const [ unlockedAchievements, getUnlockedAchievements, setUnlockedAchievements ] = useStateStorage<number[]>([], 'unlockedAchievements');

    return {
        minValue, getMinValue, setMinValue,
        maxValue, getMaxValue, setMaxValue,
        unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons,
        solvedOperations, getSolvedOperations, setSolvedOperations,
        unlockedAchievements, getUnlockedAchievements, setUnlockedAchievements
    };
};

export default useGenOpParams;
