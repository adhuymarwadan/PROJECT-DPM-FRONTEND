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

  const renderArticle = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" duration={1000} delay={index * 100}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ArticleDetail", {
            article: {
              ...item,
              description: item.description || item.content || "",
              content: item.content || item.description || "",
              url: item.url || "",
              source: item.source || "Unknown",
              publishedAt: item.createdAt || new Date().toISOString(),
            },
          })
        }
        style={styles.articleTouchable}
      >
        <View style={styles.articleCard}>
          {item.image && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.articleImage}
                resizeMode="cover"
              />
              <View style={styles.heartIconContainer}>
                <Icon name="heart" size={20} color="#CC0000" />
              </View>
            </View>
          )}
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.articleMetaContainer}>
              <Text style={styles.articleDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.readMoreText}>Read More</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 16,
      color: isDarkMode ? "#fff" : "#000",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
    articleTouchable: {
      marginBottom: 12,
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
    heartIconContainer: {
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
      fontSize: 16,
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
      fontSize: 12,
      color: isDarkMode ? "#ccc" : "#666",
    },
    readMoreText: {
      fontSize: 12,
      color: "#CC0000",
      fontWeight: "600",
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      marginTop: 50,
      color: isDarkMode ? "#ccc" : "#666",
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Animatable.Text
          animation="fadeInDown"
          duration={1500}
          style={styles.header}
        >
          {translations.likedArticles || "Liked Articles"}
        </Animatable.Text>
        {likedArticles.length === 0 ? (
          <Animatable.Text
            animation="fadeIn"
            duration={1500}
            style={styles.emptyText}
          >
            {translations.noLikedArticles || "No liked articles yet"}
          </Animatable.Text>
        ) : (
          <FlatList
            data={likedArticles}
            keyExtractor={(item) => item._id}
            renderItem={renderArticle}
            onRefresh={fetchLikedArticles}
            refreshing={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LikedArticles;
