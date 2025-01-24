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
import { useTheme } from "./ThemeContext";

const SignupScreen = ({ navigation }) => {
  const { isDarkMode, translations } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const styles = getStyles(isDarkMode);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", translations.fillAllFields);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", translations.passwordsDoNotMatch);
      return;
    }
    try {
      const response = await fetch("http://192.168.10.13:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", translations.accountCreated, [
          {
            text: "OK",
            onPress: () => {
              // Replace instead of navigate to prevent stack buildup
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.error || translations.signUpFailed);
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", translations.somethingWrong);
    }
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
            duration={1500}
            style={styles.header}
          >
            <Text style={styles.headerText}>AllNews</Text>
            <Text style={styles.subHeaderText}>
              {translations.createAccount}
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={2000}
            style={styles.card}
          >
            <Text style={styles.title}>{translations.signUp}</Text>

            <Animatable.View animation="zoomIn" duration={1500}>
              <View style={styles.inputContainer}>
                <Icon
                  name="user"
                  size={20}
                  color={isDarkMode ? "#fff" : "#666"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={translations.namePlaceholder}
                  placeholderTextColor={isDarkMode ? "#999" : "#666"}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </Animatable.View>

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

            <Animatable.View animation="zoomIn" duration={1500} delay={600}>
              <View style={styles.inputContainer}>
                <Icon
                  name="lock"
                  size={20}
                  color={isDarkMode ? "#fff" : "#666"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={translations.confirmPasswordPlaceholder}
                  placeholderTextColor={isDarkMode ? "#999" : "#666"}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? "eye" : "eye-slash"}
                    size={20}
                    color={isDarkMode ? "#fff" : "#333"}
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
                {translations.signUpButton}
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
  });

export default SignupScreen;
