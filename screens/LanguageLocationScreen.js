import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext";
import * as Animatable from "react-native-animatable";

const LanguageLocationScreen = ({ navigation }) => {
  const { isDarkMode, language, changeLanguage, translations } = useTheme();
  const styles = getStyles(isDarkMode);

  const LanguageButton = ({ lang, label }) => (
    <TouchableOpacity
      style={[
        styles.button,
        language === lang && styles.activeButton,
        styles.buttonShadow,
      ]}
      onPress={() => changeLanguage(lang)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

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
        <LanguageButton lang="en" label="English" />
        <LanguageButton lang="id" label="Indonesia" />
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
      marginBottom: 30,
      alignItems: "center",
    },
    headerText: {
      fontSize: 30,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#1a1a1a",
      letterSpacing: 1,
    },
    card: {
      backgroundColor: isDarkMode ? "#333" : "#f7f7f7",
      borderRadius: 20,
      padding: 25,
      elevation: 12,
      width: "90%",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
    },
    button: {
      backgroundColor: "#CC0000",
      paddingVertical: 15,
      borderRadius: 12,
      marginVertical: 12,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonShadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
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
      letterSpacing: 1,
    },
  });

export default LanguageLocationScreen;
