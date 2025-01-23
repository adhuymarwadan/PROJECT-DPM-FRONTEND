import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext";
import * as Animatable from "react-native-animatable";

const LanguageLocationScreen = ({ navigation }) => {
  const { isDarkMode, language, changeLanguage, translations } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.header}
      >
        <Text style={styles.headerText}>{translations.selectLanguage}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={2000} style={styles.card}>
        <TouchableOpacity
          style={[styles.button, language === "en" && styles.activeButton]}
          onPress={() => changeLanguage("en")}
        >
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, language === "id" && styles.activeButton]}
          onPress={() => changeLanguage("id")}
        >
          <Text style={styles.buttonText}>Indonesia</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#1a1a1a" : "#E0E0E0",
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
    button: {
      backgroundColor: "#CC0000",
      paddingVertical: 12,
      borderRadius: 8,
      marginVertical: 10,
      width: "100%",
      alignItems: "center",
    },
    activeButton: {
      backgroundColor: "#990000",
      borderWidth: 2,
      borderColor: "#fff",
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default LanguageLocationScreen;
