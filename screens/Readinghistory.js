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

const ReadingHistory = ({ navigation }) => {
  const [readArticles, setReadArticles] = useState([]);
  const { isDarkMode, translations } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchReadingHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchReadingHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const response = await fetch(
        "http://192.168.10.13:5000/api/reading-history",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Response status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to fetch reading history");
      }

      const data = await response.json();
      console.log("Reading history data:", data);

      if (data.success) {
        // Membuat objek baru untuk setiap artikel
        const formattedHistory = data.readingHistory.map((item) => ({
          _id: item._id,
          readAt: item.readAt,
          article: {
            ...item.article,
            image: item.article.image || item.article.urlToImage || null,
            urlToImage: item.article.image || item.article.urlToImage || null,
            content: item.article.content || item.article.description || "",
            description: item.article.description || item.article.content || "",
          },
        }));
        setReadArticles(formattedHistory);
      }
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error", "Failed to load reading history");
    }
  };

  const renderArticle = ({ item }) => {
    const articleData = {
      ...item.article,
      image: item.article.image || item.article.urlToImage || null,
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ArticleDetail", { article: articleData })
        }
      >
        <View style={styles.articleCard}>
          <Image
            source={
              articleData.image
                ? { uri: articleData.image }
                : require("../assets/WHITEjpg.jpg")
            }
            style={styles.articleImage}
            defaultSource={require("../assets/WHITEjpg.jpg")}
          />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {articleData.title}
            </Text>
            <Text style={styles.articleDate}>
              {new Date(item.readAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = getStyles(isDarkMode);

  if (readArticles.length === 0) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>{translations.readingHistory}</Text>
          <Text style={styles.emptyText}>{translations.noReadingHistory}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>{translations.readingHistory}</Text>
        <FlatList
          data={readArticles}
          keyExtractor={(item) => item._id}
          renderItem={renderArticle}
          onRefresh={fetchReadingHistory}
          refreshing={false}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      paddingTop: 50,
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#000",
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "gray",
      textAlign: "center",
      marginTop: 20,
    },
    articleCard: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      padding: 16,
      marginBottom: 16,
      borderRadius: 8,
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
    articleContent: {
      flex: 1,
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkMode ? "#fff" : "#000",
    },
    articleDate: {
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#666",
    },
  });

export default ReadingHistory;
