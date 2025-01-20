import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "./ThemeContext";

const ProfileScreen = ({ navigation }) => {
  const user = {
    name: "Muflif Fathur",
    email: "fathur0678@gmail.com",
    bio: "Sport Lover | Tech lover",
    profileImage: "https://via.placeholder.com/150",
  };

  const { isDarkMode, toggleDarkMode, translations } = useTheme();

  const styles = getStyles(isDarkMode);

  const handleLogOut = () => {
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userBio}>{user.bio}</Text>
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
            onPress={() => navigation.navigate("ReadingHistory")}
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
    userBio: {
      fontSize: 14,
      textAlign: "center",
      marginTop: 4,
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
