import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../db/firestore";
import { router } from "expo-router"; // Assuming you are using expo-router for navigation

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      // Attempt to log in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Determine role based on email domain
      const emailDomain = email.split("@")[1]; // Get the part after '@'
      let role = "Student"; // Default role

      if (emailDomain === "jaihindcollege.edu.in") {
        role = "Admin";
      }

      Alert.alert("Success", `${role} logged in successfully!`);
      console.log(`${role} logged in successfully!`);

      // Navigate to the appropriate dashboard based on the role
      if (role === "Admin") {
        router.push("/admindash");
      } else {
        router.push("/studentprofile");
      }
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.edu}>EDU</Text>
      <Text style={styles.quote}>~A place for easy management</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Pressable
          style={styles.adminButton}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  edu: {
    fontSize: 58,
    fontWeight: "900",
    marginBottom: 30,
    color: "#6EFF70",
    textAlign: "center",
    shadowColor: "#6F6ECA",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  quote: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6EB5FF",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#C4F4F8",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 30,
    color: "#510FFF",
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
  },
  adminButton: {
    backgroundColor: "#FF6EFD",
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#A21",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginPage;
