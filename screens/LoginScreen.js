import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./ThemeContext";

const LoginScreen = ({ navigation }) => {
  const { isDarkMode, translations } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const styles = getStyles(isDarkMode);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", translations.enterEmailPassword);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://192.168.10.13:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.status === 200 && data.token) {
        await AsyncStorage.setItem("userToken", data.token);
        if (data.user) {
          await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        }
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      } else {
        Alert.alert(
          "Error",
          data.error || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Connection Error",
        "Unable to connect to server. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    Alert.alert(
      translations.alert.loginError,
      translations.alert.invalidCredentials,
      [
        {
          text: translations.alert.ok,
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Animatable.View
            animation="fadeInDown"
            duration={800}
            style={styles.header}
          >
            <Text style={styles.headerText}>AllNews</Text>
            <Text style={styles.subHeaderText}>{translations.welcomeBack}</Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.card}
          >
            <Text style={styles.title}>{translations.login}</Text>

            <Animatable.View animation="zoomIn" duration={1500}>
              <View style={styles.inputContainer}>
                <Icon
                  name="envelope"
                  size={20}
                  color={isDarkMode ? "#fff" : "#666"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={translations.emailPlaceholder}
                  placeholderTextColor={isDarkMode ? "#999" : "#666"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </Animatable.View>

            <Animatable.View animation="zoomIn" duration={1500} delay={300}>
              <View style={styles.inputContainer}>
                <Icon
                  name="lock"
                  size={20}
                  color={isDarkMode ? "#fff" : "#666"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={translations.passwordPlaceholder}
                  placeholderTextColor={isDarkMode ? "#999" : "#666"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color={isDarkMode ? "#fff" : "#333"}
                  />
                </TouchableOpacity>
              </View>
            </Animatable.View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Animatable.Text
                animation="pulse"
                iterationCount="infinite"
                style={styles.buttonText}
              >
                {isLoading ? translations.loggingIn : translations.loginButton}
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
                {translations.dontHaveAccount}
              </Animatable.Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#E0E0E0",
    },
    inner: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      marginBottom: 20,
      alignItems: "center",
    },
    headerText: {
      fontSize: 40,
      fontWeight: "bold",
      color: "#CC0000",
      marginBottom: 10,
    },
    subHeaderText: {
      fontSize: 22,
      color: isDarkMode ? "#fff" : "#1a1a1a",
    },
    card: {
      backgroundColor: isDarkMode ? "#333" : "#f7f7f7",
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
      borderColor: isDarkMode ? "#666" : "#d9d9d9",
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: isDarkMode ? "#444" : "#ffffff",
    },
    inputIcon: {
      marginLeft: 10,
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      paddingHorizontal: 10,
      color: isDarkMode ? "#fff" : "#000",
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
    buttonDisabled: {
      backgroundColor: "#999",
    },
  });

export default LoginScreen;
