import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "./ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    profileImage: null,
  });

  useEffect(() => {
    fetchUserData();
    requestGalleryPermission();
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Stored token:", token);
    };
    checkToken();
  }, []);

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo gallery"
      );
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
        width: 100,
        height: 100,
      });

      if (!result.canceled) {
        const token = await AsyncStorage.getItem("userToken");
        console.log("Starting image upload...");

        let base64Image = result.assets[0].base64;

        const fileSizeInMB = (base64Image.length * 0.75) / (1024 * 1024);
        console.log("File size:", fileSizeInMB, "MB");

        if (fileSizeInMB > 1000) {
          Alert.alert(
            "Image too large",
            "Please select an image smaller than 500KB"
          );
          return;
        }

        if (base64Image.includes(",")) {
          base64Image = base64Image.split(",")[1];
        }

        const response = await fetch(
          "http://192.168.10.13:5000/upload-profile",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              image: base64Image,
            }),
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);

          if (response.status === 413) {
            Alert.alert(
              "Error",
              "Image is too large. Please choose a smaller image or try again."
            );
            return;
          }

          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Upload success:", data.success);

        if (data.success) {
          setUserData((prev) => ({
            ...prev,
            profileImage: data.imageUrl,
          }));
          Alert.alert("Success", "Profile image updated successfully");
          await fetchUserData();
        } else {
          throw new Error(data.error || "Upload failed");
        }
      }
    } catch (error) {
      console.error("Upload error details:", error);
      Alert.alert(
        "Error",
        "Failed to update profile image. Please try again with a smaller image."
      );
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const response = await fetch("http://192.168.10.13:5000/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile data:", data);

      if (data.user) {
        setUserData({
          name: data.user.name || "No Name",
          email: data.user.email || "No Email",
          profileImage: data.user.profileImage,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const user = {
    ...userData,
    profileImage: "https://via.placeholder.com/150",
  };

  const { isDarkMode, toggleDarkMode, translations } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              userData.profileImage
                ? { uri: userData.profileImage }
                : require("../assets/WHITEjpg.jpg")
            }
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Icon name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      {/* Your Activities Section */}
      <View style={[styles.section, styles.card]}>
        <Text style={styles.sectionTitle}>{translations.yourActivities}</Text>
        <View style={styles.activityRow}>
          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("LikedArticles")}
          >
            <Icon name="heart" size={24} color="#CC0000" />
            <Text style={styles.activityText}>
              {translations.likedArticles}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => {
              navigation.navigate("ReadingHistory", {
                onGoBack: () => fetchUserData(),
              });
            }}
          >
            <Icon name="history" size={24} color="#CC0000" />
            <Text style={styles.activityText}>
              {translations.readingHistory}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Section */}
      <View style={[styles.section, styles.card]}>
        <Text style={styles.sectionTitle}>{translations.account}</Text>
        <TouchableOpacity
          style={styles.preferenceRow}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Icon name="lock" size={20} color="#CC0000" />
          <Text style={styles.preferenceText}>
            {translations.changePassword}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.preferenceRow} onPress={handleLogOut}>
          <Icon name="sign-out" size={20} color="#CC0000" />
          <Text style={[styles.preferenceText, styles.logoutText]}>
            {translations.logOut}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={[styles.section, styles.card]}>
        <Text style={styles.sectionTitle}>{translations.preferences}</Text>
        <View style={styles.preferenceRow}>
          <Icon name="moon-o" size={20} color="#CC0000" />
          <Text style={styles.preferenceText}>{translations.darkMode}</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity
          style={styles.preferenceRow}
          onPress={() => navigation.navigate("LanguageLocation")}
        >
          <Icon name="globe" size={20} color="#CC0000" />
          <Text style={styles.preferenceText}>
            {translations.languageLocation}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    header: {
      alignItems: "center",
      marginVertical: 20,
      marginTop: 100,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
      backgroundColor: "#ddd",
    },
    editIconContainer: {
      position: "absolute",
      right: 0,
      bottom: 10,
      backgroundColor: "#CC0000",
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#fff",
    },
    userName: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
    },
    userEmail: {
      fontSize: 14,
      marginVertical: 4,
      color: isDarkMode ? "#ccc" : "#000",
    },
    section: {
      marginVertical: 10,
      borderRadius: 8,
      padding: 10,
      elevation: 2,
    },
    card: {
      backgroundColor: isDarkMode ? "#333" : "#E0E0E0",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
      marginBottom: 10,
    },
    activityRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },
    activityButton: {
      alignItems: "center",
    },
    activityText: {
      marginTop: 4,
      fontSize: 14,
      color: "#CC0000",
    },
    preferenceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    preferenceText: {
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#333",
      marginLeft: 10,
    },
    logoutText: {
      color: "#CC0000",
    },
  });

export default ProfileScreen;
