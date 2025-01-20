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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://192.168.10.8:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert("Success", "Login successful");
        // Navigasi ke halaman beranda atau lainnya
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Error", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.header}
      >
        <Text style={styles.headerText}>Welcome Back!</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={2000} style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Animatable.View animation="zoomIn" duration={1500}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </Animatable.View>

        <Animatable.View animation="zoomIn" duration={1500} delay={300}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            style={styles.buttonText}
          >
            Login
          </Animatable.Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Animatable.Text
            animation="fadeIn"
            delay={2000}
            style={styles.linkText}
          >
            Don't have an account? Sign Up
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
  input: {
    height: 50,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  eyeIcon: {
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
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#CC0000",
    fontSize: 16,
  },
});

export default LoginScreen;
