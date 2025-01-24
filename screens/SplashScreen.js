import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useTheme } from "../screens/ThemeContext";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const fadeAnim = new Animated.Value(0); // Animasi untuk efek fade-in
  const scaleAnim = new Animated.Value(0.8); // Animasi untuk efek scaling
  const slideAnim = new Animated.Value(height); // Animasi untuk efek slide-in lingkaran latar

  useEffect(() => {
    // Efek animasi fade-in, scale-in, dan slide-in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Navigasi ke layar berikutnya setelah 3 detik
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundCircle,
          { transform: [{ translateY: slideAnim }] },
        ]}
      />
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    },
    backgroundCircle: {
      position: "absolute",
      width: width * 1.8,
      height: width * 1.8,
      borderRadius: (width * 1.8) / 2,
      backgroundColor: isDarkMode ? "#333" : "#f0f0f5",
      top: -width * 0.9,
      left: -width * 0.45,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
    },
    appName: {
      fontSize: 48,
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: 2,
      color: isDarkMode ? "#fff" : "#1a1a1a",
    },
    news: {
      color: "#ffffff", // Warna putih untuk teks "News"
      backgroundColor: "#007BFF", // Biru cerah sebagai aksen
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      overflow: "hidden",
      fontWeight: "800",
    },
  });

export default SplashScreen;
