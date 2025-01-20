import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://192.168.10.8:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.error || "Sign-up failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.header}
      >
        <Text style={styles.headerText}>Create Your Account</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={2000} style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <Animatable.View animation="zoomIn" duration={1500}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>
        </Animatable.View>

        <Animatable.View animation="zoomIn" duration={1500}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        </Animatable.View>

        <Animatable.View animation="zoomIn" duration={1500} delay={300}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="zoomIn" duration={1500} delay={600}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            style={styles.buttonText}
          >
            Sign Up
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#CC0000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#CC0000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignupScreen;
