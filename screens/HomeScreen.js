import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { useBookmark } from "../BookmarkContext";
import { useTheme } from "./ThemeContext";

const HomeScreen = ({ navigation, route }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category || "business"
  );
  const [likedArticles, setLikedArticles] = useState([]);

  const { toggleBookmark, bookmarkedArticles } = useBookmark();
  const { isDarkMode, translations } = useTheme();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const responseMediastack = await fetch(
          `http://api.mediastack.com/v1/news?access_key=524001cfb24c248d8e3803a4816e2d98countries=id`
        );
        const response1 = await fetch(
          `https://newsapi.org/v2/everything?q=tesla&from=2024-12-10&sortBy=publishedAtlanguage=id&apiKey=3a2e801c26014da0a670421790eec778`
        );
        const response2 = await fetch(
          `https://newsapi.org/v2/everything?q=apple&from=2024-12-10&sortBy=publishedAtlanguage=idapiKey=3a2e801c26014da0a670421790eec778`
        );
        const response3 = await fetch(
          `https://newsapi.org/v2/everything?q=bitcoin&from=2024-12-10&sortBy=publishedAt&language=idapiKey=3a2e801c26014da0a670421790eec778`
        );
        const response4 = await fetch(
          `https://newsapi.org/v2/everything?q=space&from=2024-12-10&sortBy=publishedAt&language=idapiKey=3a2e801c26014da0a670421790eec778`
        );

        if (
          !responseMediastack.ok ||
          !response1.ok ||
          !response2.ok ||
          !response3.ok ||
          !response4.ok
        ) {
          throw new Error(
            `HTTP error! Status: ${responseMediastack.status}, ${response1.status}, ${response2.status}, ${response3.status}, or ${response4.status}`
          );
        }

        const dataMediastack = await responseMediastack.json();
        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();
        const data4 = await response4.json();

        console.log("Mediastack data:", dataMediastack); // Log untuk memeriksa data dari Mediastack

        const combinedArticles = [
          ...(dataMediastack.data || []),
          ...(data1.articles || []),
          ...(data2.articles || []),
          ...(data3.articles || []),
          ...(data4.articles || []),
        ];

        if (combinedArticles && Array.isArray(combinedArticles)) {
          const validArticles = combinedArticles.filter(
            (article) => article.title && article.url
          );
          setArticles(validArticles);
          setFilteredArticles(validArticles);
        } else {
          console.warn("Unexpected API response format:", {
            dataMediastack,
            data1,
            data2,
            data3,
            data4,
          });
          setArticles([]);
          setFilteredArticles([]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  const handleLike = (article) => {
    setLikedArticles((prev) =>
      prev.includes(article)
        ? prev.filter((a) => a !== article)
        : [...prev, article]
    );
  };

  const renderArticle = ({ item, index }) => {
    if (!item.title) return null;

    return (
      <Animatable.View animation="fadeInUp" duration={1000} delay={index * 100}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ArticleDetail", { article: item })
          }
        >
          <View style={styles.articleCard}>
            {item.image || item.urlToImage ? (
              <Image
                source={{ uri: item.image || item.urlToImage }}
                style={styles.articleImage}
              />
            ) : null}
            <View style={styles.articleContentContainer}>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleMeta}>{item.publishedAt}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(item)}
                >
                  <Icon
                    name="thumbs-up"
                    size={16}
                    color={likedArticles.includes(item) ? "red" : "#E0E0E0"}
                  />
                  <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleBookmark(item)}
                >
                  <Icon
                    name="bookmark"
                    size={16}
                    color={
                      bookmarkedArticles.find((a) => a.title === item.title)
                        ? "gold"
                        : "#007BFF"
                    }
                  />
                  <Text style={styles.actionText}>Bookmark</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Animatable.Text
            animation="fadeInDown"
            duration={1500}
            style={styles.headerText}
          >
            News
          </Animatable.Text>
        </View>
        <Animatable.View animation="fadeInDown" duration={1500} delay={500}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder={translations.searchNews}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </Animatable.View>
        <Animatable.View
          animation="fadeInDown"
          duration={1500}
          delay={800}
          style={styles.tabContainer}
        >
          {["business", "technology", "health", "science", "sports"].map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedCategory(tab)}
              >
                <Text
                  style={
                    selectedCategory === tab
                      ? [styles.tab, styles.tabActive]
                      : styles.tab
                  }
                >
                  {translations.categories[tab]}
                </Text>
              </TouchableOpacity>
            )
          )}
        </Animatable.View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderArticle}
          contentContainerStyle={styles.articleList}
        />
      )}
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    },
    topContainer: {
      backgroundColor: isDarkMode ? "#333" : "#E0E0E0",
      paddingBottom: 16,
    },
    header: {
      padding: 20,
      alignItems: "center",
    },
    headerText: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
    },
    searchContainer: {
      padding: 10,
      borderRadius: 8,
      marginBottom: 16,
    },
    searchBar: {
      backgroundColor: isDarkMode ? "#444" : "#fff",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? "#555" : "#ddd",
      color: isDarkMode ? "#fff" : "#000",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderBottomWidth: 1,
      flexWrap: "wrap",
      borderBottomColor: isDarkMode ? "#555" : "#ddd",
    },
    tab: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#CC0000",
      paddingBottom: 8,
      paddingHorizontal: 5,
       textAlign: "center",
    },
    tabActive: {
      color: isDarkMode ? "#fff" : "#333",
      borderBottomWidth: 2,
      borderBottomColor: "#CC0000",
    },
    articleList: {
      paddingHorizontal: 16,
    },
    articleCard: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    articleImage: {
      width: "100%",
      height: 180,
    },
    articleContentContainer: {
      padding: 16,
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
      marginBottom: 8,
    },
    articleMeta: {
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#777",
      marginBottom: 8,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      marginLeft: 4,
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#828282",
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default HomeScreen;
