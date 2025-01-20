import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView, // Import SafeAreaView
} from "react-native";
import { useBookmark } from "../BookmarkContext";
import { useTheme } from "./ThemeContext"; // Import useTheme

const BookmarkScreen = ({ navigation }) => {
  const { bookmarkedArticles } = useBookmark();
  const { isDarkMode, translations } = useTheme(); // Gunakan useTheme

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ArticleDetail", { article: item })}
    >
      <View style={styles.articleCard}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.articleImage} />
        )}
        <Text style={styles.articleTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const styles = getStyles(isDarkMode); // Gunakan getStyles dengan isDarkMode

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>{translations.bookmarks}</Text>
        {bookmarkedArticles.length === 0 ? (
          <Text style={styles.emptyText}>{translations.noBookmarks}</Text>
        ) : (
          <FlatList
            data={bookmarkedArticles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderArticle}
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
    }, // Safe container for SafeAreaView
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      paddingTop: 50,
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#000",
    },
    emptyText: {
      fontSize: 18,
      color: isDarkMode ? "#ccc" : "gray",
      textAlign: "center",
      marginTop: 20,
    },
    articleCard: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? "#333" : "#ddd",
    },
    articleImage: { width: "100%", height: 150, borderRadius: 5 },
    articleTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 5,
      color: isDarkMode ? "#fff" : "#000",
    },
  });

export default BookmarkScreen;
