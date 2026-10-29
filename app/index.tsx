
import { router } from "expo-router";
import {Pressable, Text, View, StyleSheet} from "react-native";

const HomePage=() => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>EDU</Text>
            <Text style={styles.quote}>~College Management Made Easier</Text>
            <View style={styles.container2}>
            <Pressable onPress={() => router.push("/login")} style={styles.log_buton}>
                <Text style={styles.log}>Login</Text>
            </Pressable>
            </View>
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        height:"100%",
        backgroundColor:"#C4F4F8"
    },
    title:{
        fontSize:50,
        fontWeight:"bold",
        color:"#2b20fa",
    },
    quote:{
        fontSize:20,
        fontStyle:"italic",
        color:"#19147a"
    },
    log_buton:{
        fontSize:18,
        fontStyle:"italic",
        fontWeight:"bold",
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: "#6EF5FF",
        paddingVertical: 15,
        width: "80%",
        alignItems: "center",
        borderColor: "#11A1FF",
        alignSelf:"auto",
    },
    container2:{
        paddingVertical:150,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 5,
        width:"100%",
    },
    log:{
        fontSize:30,
        fontWeight:"bold",
        color:"#6F30FF",
    },
});

export default HomePage;


