import {Debug, debugOptions, openPrompt} from "@/scripts/debug";
import {Text, View} from "react-native";
import styles from "@/styles/styles";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBrain, faBug, faStar} from "@fortawesome/free-solid-svg-icons";
import NumberToIcons from "@/components/NumberToIcons";
import CalcButton from "@/components/CalcButton";
import {DynamicModal1} from "@/components/DynamicModal";
import AchievementsList from "@/components/AchievementsList";

interface HeaderProps {
    experience: number;
    debugOptions: debugOptions;
    achievements: number[];
}

export default ({ experience, debugOptions, achievements }: HeaderProps) => {
    const [pop, modal] = DynamicModal1();

    return <View style={styles.header}>
        <FontAwesomeIcon icon={faBrain} />
        <NumberToIcons number={experience} />
        <View style={styles.headerSpacer} />
        <CalcButton icon={faStar} onPress={() => {
            pop(<>
                <Text style={styles.modalTitle}>¡Logros!</Text>
                <AchievementsList unlockedAchievements={achievements} />
            </>);
        }} style={styles.debugButton} />
        <CalcButton icon={faBug} onPress={() => openPrompt(debugOptions)} style={styles.debugButton} />
        {modal}
    </View>
};