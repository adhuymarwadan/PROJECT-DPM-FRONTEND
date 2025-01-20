import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "./ThemeContext"; // Import useTheme

const ArticleDetail = ({ route, navigation }) => {
  const { article } = route.params;
  const { isDarkMode } = useTheme(); // Gunakan useTheme

  const styles = getStyles(isDarkMode); // Gunakan getStyles dengan isDarkMode

  console.log("Article data:", article); // Log untuk memeriksa data artikel

  return (
    <ScrollView style={styles.container}>
      {/* Image and Overlay */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: article.image }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.category}>{article.category || "Tech"}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.meta}>
            {article.published_at} |{" "}
            {Math.ceil(article.description.length / 250)} min read
          </Text>
        </View>
      </View>

      {/* Author Info */}
      <View style={styles.authorContainer}>
        <Image
          source={{
            uri: article.author_image || "https://via.placeholder.com/50",
          }}
          style={styles.authorImage}
        />
        <View>
          <Text style={styles.authorName}>
            {article.author || "Unknown Author"}
          </Text>
          <Text style={styles.commentCount}>
            {article.comments || 12} comments
          </Text>
        </View>
      </View>

      {/* Article Content */}
      <Text style={styles.content}>{article.description}</Text>
      <TouchableOpacity>
        <Text style={styles.readMore}>Read more</Text>
      </TouchableOpacity>

      {/* Related Articles */}
      <View style={styles.relatedContainer}>
        <Text style={styles.relatedTitle}>
          Related in {article.category || "Tech"}
        </Text>
        <TouchableOpacity style={styles.relatedCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.relatedImage}
          />
          <View style={styles.relatedContent}>
            <Text style={styles.relatedArticleTitle}>
              Tesla's quarterly profit surpasses $1 billion
            </Text>
            <Text style={styles.relatedMeta}>2 days ago | 4 min read</Text>
          </View>
        </TouchableOpacity>
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
    imageContainer: {
      position: "relative",
    },
    image: {
      width: "100%",
      height: 250,
    },
    overlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    category: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      marginBottom: 8,
    },
    title: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 4,
    },
    meta: {
      color: "#ddd",
      fontSize: 14,
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    authorImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    authorName: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
    },
    commentCount: {
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#777",
    },
    content: {
      padding: 16,
      fontSize: 16,
      lineHeight: 24,
      color: isDarkMode ? "#ccc" : "#444",
    },
    readMore: {
      color: "#CC0000",
      padding: 16,
      fontSize: 16,
      textAlign: "right",
    },
    relatedContainer: {
      paddingHorizontal: 16,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? "#333" : "#eee",
    },
    relatedTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
      marginBottom: 16,
    },
    relatedCard: {
      flexDirection: "row",
      marginBottom: 16,
      backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
      borderRadius: 8,
      overflow: "hidden",
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    relatedImage: {
      width: 100,
      height: 80,
    },
    relatedContent: {
      flex: 1,
      padding: 8,
    },
    relatedArticleTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
      marginBottom: 4,
    },
    relatedMeta: {
      fontSize: 12,
      color: isDarkMode ? "#ccc" : "#777",
    },
  });

export default ArticleDetail;
