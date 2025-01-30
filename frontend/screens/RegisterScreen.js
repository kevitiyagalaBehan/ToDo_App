import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleRegister = async () => {
    try {
      console.log("Register button clicked");

      // Trim inputs
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      // Validation checks
      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        console.log("Validation failed: Empty fields");
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        console.log("Validation failed: Invalid email");
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      if (trimmedPassword.length < 6) {
        console.log("Validation failed: Password too short");
        Alert.alert("Error", "Password must be at least 6 characters long");
        return;
      }

      if (trimmedName.length < 2 || /\d/.test(trimmedName)) {
        console.log("Validation failed: Invalid name");
        Alert.alert("Error", "Please enter a valid name");
        return;
      }

      console.log("All validation checks passed, sending request...");

      // Make API request
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      console.log("Registration successful:", res.data);
      Alert.alert("Success", "Registration successful");
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.log(
        "Registration error:",
        error?.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Error registering user"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            Register
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRedirect}>
          <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={{ color: "blue", fontWeight: "600", fontSize: 14 }}>
              {" "}
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "blue",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "blue",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loginRedirect: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
});
