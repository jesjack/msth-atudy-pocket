// styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
    },
    header: {
        marginTop: 75,
        paddingHorizontal: 75,
        width: '100%',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        // backgroundColor: "red",
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
    },
    largeText: {
        fontSize: 40,
    },
    numberInput: {
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 40,
        textAlign: "center",
        flex: 1,
        maxWidth: 250,
    },
    result: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        display: "flex",
        width: '100%',
    },
    question: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        display: "flex",
        gap: 10,
    },
    layout1: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minWidth: 300,
        padding: 10,
        width: 280,
        alignItems: "center",
    },
    resultButton: {
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 5,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
    },
    layout2: {
        display: "flex",
        flexDirection: "column",
        minWidth: 300,
        padding: 10,
        width: 320,
        alignItems: "center",
    },
    gridItem: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    l2Row: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    calcText: {
        fontSize: 30,
        color: "white",
    },
    calcButton: {
        width: 80,
        height: 80,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        flexDirection: "row",
    },
    returnButton: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
    },
    questionText: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    headerSpacer: {
        flex: 1,
        // backgroundColor: "red",
    }, debugButton: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
    },
});

export default styles;
