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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const BookmarkScreen = ({ navigation }) => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, translations } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBookmarks();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const response = await fetch(
        `http://192.168.10.13:5000/api/bookmarks/user`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const validBookmarks = result.data.filter(
          (bookmark) => bookmark && bookmark.article && bookmark.article.title
        );
        setBookmarkedArticles(validBookmarks);
      } else {
        setBookmarkedArticles([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      Alert.alert(
        "Error",
        "Failed to load bookmarks. Please check your connection."
      );
      setBookmarkedArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(
        `http://192.168.10.13:5000/api/bookmarks/${bookmarkId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setBookmarkedArticles((prev) =>
          prev.filter((article) => article._id !== bookmarkId)
        );
        Alert.alert("Success", "Bookmark removed successfully");
      } else {
        throw new Error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      Alert.alert("Error", "Failed to remove bookmark");
    }
  };

  const renderArticle = ({ item, index }) => {
    const articleData = item.article || item;

    if (!articleData || !articleData.title) {
      return null;
    }

    const formattedArticle = {
      title: articleData.title || "Untitled Article",
      description: articleData.content || "",
      urlToImage: articleData.image || null,
      image: articleData.image || null,
      publishedAt: articleData.createdAt || new Date().toISOString(),
      content: articleData.content || "",
    };

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 200}
        duration={1000}
        useNativeDriver
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ArticleDetail", { article: formattedArticle })
          }
          style={styles.articleCardContainer}
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
              resizeMode="cover"
            />
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {articleData.title || "Untitled Article"}
              </Text>
              <View style={styles.articleMetaContainer}>
                <Text style={styles.articleDate}>
                  {articleData.createdAt
                    ? new Date(articleData.createdAt).toLocaleDateString()
                    : "Date not available"}
                </Text>
                <Animatable.View
                  animation="pulse"
                  iterationCount={1}
                  useNativeDriver
                >
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeBookmark(item._id)}
                  >
                    <Icon name="trash" size={18} color="#fff" />
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={styles.headerContainer}
        >
          <Text style={styles.header}>{translations.bookmarks}</Text>
        </Animatable.View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CC0000" />
          </View>
        ) : bookmarkedArticles.length === 0 ? (
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={styles.emptyContainer}
          >
            <Icon name="bookmark-outline" size={80} color="#CC0000" />
            <Text style={styles.emptyText}>{translations.noBookmarks}</Text>
          </Animatable.View>
        ) : (
          <FlatList
            data={bookmarkedArticles}
            keyExtractor={(item) =>
              item._id?.toString() || Math.random().toString()
            }
            renderItem={renderArticle}
            onRefresh={fetchBookmarks}
            refreshing={isLoading}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "left",
      color: isDarkMode ? "#fff" : "#000",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 18,
      color: isDarkMode ? "#ccc" : "gray",
      textAlign: "center",
      marginTop: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    articleCardContainer: {
      marginBottom: 16,
    },
    articleCard: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      borderRadius: 15,
      overflow: "hidden",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    articleImage: {
      width: "100%",
      height: 220,
      backgroundColor: "#f0f0f0",
    },
    articleContent: {
      padding: 15,
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 10,
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
    removeButton: {
      backgroundColor: "#CC0000",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    removeButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 5,
    },
  });

export default BookmarkScreen;
