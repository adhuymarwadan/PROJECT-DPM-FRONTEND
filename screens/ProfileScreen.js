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
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled) {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "Please login again");
          return;
        }

        setUserData((prev) => ({
          ...prev,
          profileImage: `data:image/jpeg;base64,${result.assets[0].base64}`,
        }));

        try {
          const response = await fetch(
            "http://192.168.10.13:5000/upload-profile",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                image: `data:image/jpeg;base64,${result.assets[0].base64}`,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            Alert.alert("Success", "Profile image updated successfully");
          } else {
            throw new Error(data.error || "Failed to update profile image");
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          await fetchUserData();
          Alert.alert(
            "Error",
            "Failed to update profile image. Please try again with a smaller image."
          );
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to select image");
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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

  const { isDarkMode, toggleDarkMode, translations } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Improved Layout */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.profileImageWrapper}
        >
          <Image
            source={
              userData.profileImage
                ? { uri: userData.profileImage }
                : require("../assets/WHITEjpg.jpg")
            }
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Icon name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName} numberOfLines={1}>
          {userData.name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {userData.email}
        </Text>
      </View>

      {/* Sections with Improved Spacing and Design */}
      <View style={styles.sectionsContainer}>
        {/* Your Activities Section */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.sectionTitle}>{translations.yourActivities}</Text>
          <View style={styles.activityRow}>
            <TouchableOpacity
              style={styles.activityButton}
              onPress={() => navigation.navigate("LikedArticles")}
            >
              <View style={styles.activityIconContainer}>
                <Icon name="heart" size={24} color="#CC0000" />
              </View>
              <Text style={styles.activityText} numberOfLines={1}>
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
              <View style={styles.activityIconContainer}>
                <Icon name="history" size={24} color="#CC0000" />
              </View>
              <Text style={styles.activityText} numberOfLines={1}>
                {translations.readingHistory}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.sectionTitle}>{translations.account}</Text>
          <View style={styles.preferenceList}>
            <TouchableOpacity
              style={styles.preferenceRow}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <View style={styles.preferenceIconContainer}>
                <Icon name="lock" size={20} color="#CC0000" />
              </View>
              <Text style={styles.preferenceText}>
                {translations.changePassword}
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.preferenceRow}
              onPress={handleLogOut}
            >
              <View style={styles.preferenceIconContainer}>
                <Icon name="sign-out" size={20} color="#CC0000" />
              </View>
              <Text style={[styles.preferenceText, styles.logoutText]}>
                {translations.logOut}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.sectionTitle}>{translations.preferences}</Text>
          <View style={styles.preferenceList}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceIconContainer}>
                <Icon name="moon-o" size={20} color="#CC0000" />
              </View>
              <Text style={styles.preferenceText}>{translations.darkMode}</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#767577", true: "#CC0000" }}
                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.preferenceRow}
              onPress={() => navigation.navigate("LanguageLocation")}
            >
              <View style={styles.preferenceIconContainer}>
                <Icon name="globe" size={20} color="#CC0000" />
              </View>
              <Text style={styles.preferenceText}>
                {translations.languageLocation}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    headerContainer: {
      alignItems: "center",
      paddingVertical: 30,
      backgroundColor: isDarkMode ? "#222" : "#f5f5f5",
    },
    profileImageWrapper: {
      marginBottom: 15,
    },
    profileImage: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 3,
      borderColor: "#CC0000",
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
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 5,
    },
    userEmail: {
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "#666",
    },
    sectionsContainer: {
      paddingHorizontal: 15,
    },
    section: {
      marginVertical: 10,
      borderRadius: 12,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    card: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
      marginBottom: 15,
    },
    activityRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    activityButton: {
      alignItems: "center",
      width: "45%",
    },
    activityIconContainer: {
      backgroundColor: isDarkMode ? "#444" : "#f0f0f0",
      padding: 15,
      borderRadius: 50,
      marginBottom: 10,
    },
    activityText: {
      fontSize: 14,
      color: "#CC0000",
      textAlign: "center",
    },
    preferenceList: {
      borderRadius: 10,
      overflow: "hidden",
    },
    preferenceRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 5,
    },
    preferenceIconContainer: {
      width: 40,
      alignItems: "center",
    },
    preferenceText: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#333",
    },
    logoutText: {
      color: "#CC0000",
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? "#444" : "#e0e0e0",
    },
  });

export default ProfileScreen;
