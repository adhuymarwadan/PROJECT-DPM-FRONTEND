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
import { useTheme } from "./ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { isDarkMode, translations } = useTheme();

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", translations.allFieldsRequired);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", translations.passwordsDoNotMatch);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", translations.notAuthenticated);
        navigation.replace("Login");
        return;
      }

      const response = await fetch(
        "http://192.168.10.13:5000/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert("Success", translations.passwordChangedSuccess);
        // Clear the input fields
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          data.error === "Old password is incorrect"
            ? translations.oldPasswordIncorrect
            : translations.passwordChangeFailed
        );
      }
    } catch (error) {
      console.error("Change password error:", error);
      Alert.alert("Error", translations.somethingWentWrong);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.header}
      >
        <Text style={styles.headerText}>{translations.changePassword}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={2000} style={styles.card}>
        <Animatable.View animation="zoomIn" duration={1500}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Icon
                name={showOldPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="zoomIn" duration={1500} delay={300}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Icon
                name={showNewPassword ? "eye" : "eye-slash"}
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
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry={!showConfirmNewPassword}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              <Icon
                name={showConfirmNewPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            style={styles.buttonText}
          >
            Change Password
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#E0E0E0",
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

export default ChangePasswordScreen;
