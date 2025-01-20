import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext";

const LanguageLocationScreen = ({ navigation }) => {
  const { language, changeLanguage } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeLanguage("en")}
      >
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeLanguage("id")}
      >
        <Text style={styles.buttonText}>Indonesian</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#CC0000",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default LanguageLocationScreen;
