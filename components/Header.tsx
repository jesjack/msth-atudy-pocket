import {Debug, debugOptions, openPrompt} from "@/scripts/debug";
import {View} from "react-native";
import styles from "@/styles/styles";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBrain, faBug} from "@fortawesome/free-solid-svg-icons";
import NumberToIcons from "@/components/NumberToIcons";
import CalcButton from "@/components/CalcButton";

export default ({ experience, debugOptions }: { experience: number, debugOptions: debugOptions }) => (
    <View style={styles.header}>
        <FontAwesomeIcon icon={faBrain} />
        <NumberToIcons number={experience} />
        <View style={styles.headerSpacer} />
        <CalcButton icon={faBug} onPress={() => openPrompt(debugOptions)} style={styles.debugButton} />
    </View>
);