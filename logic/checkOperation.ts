import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {playSound} from "@/sound/soundManager";
import {Audio} from "expo-av";
import {Operation} from "@/interfaces/Operation";
import {calculateResult} from "@/logic/calculatorLogic";
import Toast from "react-native-toast-message";
import Confetti from "react-native-confetti";
import {faDivide, faMinus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {Achievement, achievements} from "@/constants/achievements";

export function handlePressGen(
    checkOperation: () => Promise<void> | undefined,
    useOperationManagement: ReturnType<typeof import('@/hooks/useOperationManagement').default>
) {
    const {
        sound, setSound,
        experience, getExperience, setExperience,
        minValue, getMinValue, setMinValue,
        maxValue, getMaxValue, setMaxValue,
        unlockedOperationIcons, getUnlockedOperationIcons, setUnlockedOperationIcons,
        solvedOperations, getSolvedOperations, setSolvedOperations,
        capInfinity, getCapInfinity, setCapInfinity,
        currentOperation, getCurrentOperation, setCurrentOperation,
        inputValue, getInputValue, setInputValue,
        pass, getPass, setPass,
        explosion, getExplosion, setExplosion,
        generateNewOperation
    } = useOperationManagement;

    return (icon: IconDefinition | 'capInfinity') => {
        playSound('click', setSound).then();

        if (icon === 'capInfinity') {
            setInputValue('±∞');
            return;
        }

        const symbolMap: { [key: string]: string } = {
            minus: '-',
            'circle-dot': '.',
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        };
        const symbol = symbolMap[icon.iconName] || '';
        const newValue = getInputValue() + symbol;
        const result = calculateResult(getCurrentOperation());
        setInputValue(newValue.toString());

        if (getPass() || (result.value.toString().length !== newValue.toString().length)) return;
        if (parseFloat(newValue) === result.value) checkOperation()?.then();
        else setPass(true);
    };
}

function achievementToast(achievement: Achievement) {
    Toast.show({
        type: 'success',
        text1: 'Logro desbloqueado',
        text2: achievement.name,
        visibilityTime: 2000,
        position: 'bottom',
    });
}

export function checkOpGen(
    useOperationManagement: ReturnType<typeof import('@/hooks/useOperationManagement').default>
) {
    const {
        setSound,
        getExperience, setExperience,
        getMaxValue, setMaxValue,
        getMinValue, setMinValue,
        getUnlockedOperationIcons, setUnlockedOperationIcons,
        getSolvedOperations, setSolvedOperations,
        getCapInfinity, setCapInfinity,
        getCurrentOperation, setCurrentOperation,
        getInputValue, setInputValue,
        setPass, getExplosion,
        generateNewOperation,
        getUnlockedAchievements, setUnlockedAchievements
    } = useOperationManagement;

    return () => {
        // esto debería ser cuando es n/0, infinito gorrito como resultado
        if (getCapInfinity()) {
            if (getInputValue() === '±∞') {
                playSound('correct', setSound).then();
                setInputValue('');
                setExperience(getExperience() + 50);
                setSolvedOperations([...getSolvedOperations(), getCurrentOperation()]);
                setMaxValue(getMaxValue() + 1);
                setCurrentOperation(generateNewOperation());
                setCapInfinity(getCurrentOperation().bValue === 0 && getCurrentOperation().operationIcon.iconName === 'divide');
                return;
            }
            playSound('incorrect', setSound).then(() => setExperience(getExperience() - 1));
            return;
        }

        const result = calculateResult(getCurrentOperation());
        const resultValue = Number(result.value.toFixed(1));
        const inputValueValue = Number(parseFloat(getInputValue()).toFixed(1));
        if (inputValueValue !== resultValue)
            return playSound('incorrect', setSound).then(() => setExperience(getExperience() - 1));
        playSound('correct', setSound).then();
        setInputValue('');
        setExperience(getExperience() + result.xp);
        setSolvedOperations([...getSolvedOperations(), getCurrentOperation()]);
        setMaxValue(getMaxValue() + 1);

        // check if the achievement 9 is unlocked
        if (getUnlockedAchievements().includes(9)) {
            if (getCurrentOperation().operationIcon.iconName === 'minus' || resultValue < 0) {
                setMinValue(getMinValue() - 1);
            }
        }

        const explosion = getExplosion();
        if (explosion) explosion.startConfetti();
        setPass(false);

        Toast.show({
            type: 'success',
            text1: 'Correcto',
            text2: `+${result.xp} XP`,
            visibilityTime: 1000,
            position: 'bottom',
        });

        const unlockedAchievements = getUnlockedAchievements();
        achievements.filter(achievement => !unlockedAchievements.includes(achievement.id)).forEach(achievement => {
            if (achievement.validationFunction(useOperationManagement)) {
                setUnlockedAchievements([...unlockedAchievements, achievement.id]);
                achievementToast(achievement);
            }
        });

        setCurrentOperation(generateNewOperation());
        setCapInfinity(getCurrentOperation().bValue === 0 && getCurrentOperation().operationIcon.iconName === 'divide');
    };
}