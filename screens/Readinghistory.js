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
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";

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

  const renderArticle = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" duration={1000} delay={index * 100}>
      <TouchableOpacity
        onPress={() => {
          // Format article data properly before navigation
          const formattedArticle = {
            title: item.article.title,
            description: item.article.description || item.article.content || "",
            content: item.article.content || item.article.description || "",
            image: item.article.image || item.article.urlToImage,
            urlToImage: item.article.image || item.article.urlToImage,
            publishedAt: item.readAt,
            author: item.article.author || "AllNews",
            category: "News",
            source: { name: "Reading History" },
          };

          navigation.navigate("ArticleDetail", {
            article: formattedArticle,
          });
        }}
        style={styles.articleTouchable}
      >
        <View style={styles.articleCard}>
          <View style={styles.imageContainer}>
            <Image
              source={
                item.article.image
                  ? { uri: item.article.image }
                  : require("../assets/WHITEjpg.jpg")
              }
              style={styles.articleImage}
              defaultSource={require("../assets/WHITEjpg.jpg")}
              resizeMode="cover"
            />
            <View style={styles.readIconContainer}>
              <Icon name="eye" size={20} color="#CC0000" />
            </View>
          </View>
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {item.article.title}
            </Text>
            <View style={styles.articleMetaContainer}>
              <Text style={styles.articleDate}>
                {new Date(item.readAt).toLocaleDateString()}
              </Text>
              <Text style={styles.readMoreText}>Read More</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Animatable.Text
          animation="fadeInDown"
          duration={1500}
          style={styles.header}
        >
          {translations.readingHistory || "Riwayat Bacaan"}
        </Animatable.Text>
        {readArticles.length === 0 ? (
          <Animatable.View
            animation="fadeIn"
            duration={1500}
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyText}>
              {translations.noReadingHistory || "Belum ada riwayat bacaan"}
            </Text>
            <Text style={styles.infoText}>
              {translations.readingHistoryInfo ||
                "Artikel dalam riwayat bacaan akan dihapus secara otomatis setelah 30 hari"}
            </Text>
          </Animatable.View>
        ) : (
          <Animatable.View animation="fadeIn" duration={1500}>
            <Text style={styles.infoText}>
              {translations.readingHistoryInfo ||
                "Artikel dalam riwayat bacaan akan dihapus secara otomatis setelah 30 hari"}
            </Text>
            <FlatList
              data={readArticles}
              keyExtractor={(item) => item._id}
              renderItem={renderArticle}
              onRefresh={fetchReadingHistory}
              refreshing={false}
              showsVerticalScrollIndicator={false}
            />
          </Animatable.View>
        )}
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
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "gray",
      textAlign: "center",
      marginTop: 20,
    },
    infoText: {
      fontSize: 12,
      color: isDarkMode ? "#999" : "#666",
      textAlign: "center",
      marginTop: 8,
      marginBottom: 16,
      fontStyle: "italic",
    },
    articleTouchable: {
      marginBottom: 16,
    },
    articleCard: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: "hidden",
    },
    imageContainer: {
      position: "relative",
      width: "100%",
    },
    articleImage: {
      width: "100%",
      height: 200,
    },
    readIconContainer: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(255,255,255,0.8)",
      borderRadius: 20,
      padding: 8,
    },
    articleContent: {
      padding: 12,
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkMode ? "#fff" : "#000",
    },
    articleMetaContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    articleDate: {
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#666",
    },
    readMoreText: {
      fontSize: 12,
      color: "#CC0000",
      fontWeight: "600",
    },
  });

export default ReadingHistory;
