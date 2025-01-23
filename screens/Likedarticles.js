import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./ThemeContext";

const LikedArticles = ({ navigation }) => {
  const [likedArticles, setLikedArticles] = useState([]);
  const { isDarkMode, translations } = useTheme();

  useEffect(() => {
    fetchLikedArticles();
  }, []);

  const fetchLikedArticles = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const response = await fetch(
        "http://192.168.10.13:5000/api/liked-articles",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch liked articles");
      }

      const data = await response.json();
      if (data.success) {
        setLikedArticles(data.likedArticles);
      }
    } catch (error) {
      console.error("Error fetching liked articles:", error);
      Alert.alert("Error", "Failed to load liked articles");
    }
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ArticleDetail", { article: item })}
    >
      <View style={styles.articleCard}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.articleImage} />
        )}
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: isDarkMode ? "#fff" : "#000",
    },
    articleCard: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    articleImage: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 8,
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkMode ? "#fff" : "#000",
    },
    articleDate: {
      fontSize: 12,
      color: isDarkMode ? "#ccc" : "#666",
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "#666",
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>
          {translations.likedArticles || "Liked Articles"}
        </Text>
        {likedArticles.length === 0 ? (
          <Text style={styles.emptyText}>
            {translations.noLikedArticles || "No liked articles yet"}
          </Text>
        ) : (
          <FlatList
            data={likedArticles}
            keyExtractor={(item) => item._id}
            renderItem={renderArticle}
            onRefresh={fetchLikedArticles}
            refreshing={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LikedArticles;
