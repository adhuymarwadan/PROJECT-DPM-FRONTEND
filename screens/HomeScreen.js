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
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { useBookmark } from "../BookmarkContext";
import { useTheme } from "./ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

if (Platform.OS === "android") {
  // Untuk development di Android
  console.log("Setting up network security config");
  require("../android/app/src/main/res/xml/network_security_config.xml");
}

const HomeScreen = ({ navigation, route }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category || "business"
  );
  const [likedArticles, setLikedArticles] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  const {
    toggleBookmark,
    bookmarkedArticles: contextBookmarkedArticles,
    setBookmarkedArticles: setContextBookmarkedArticles,
  } = useBookmark();
  const { isDarkMode, translations } = useTheme();

  // Mengambil userData dari route params (dari LoginScreen)
  const userData = route.params?.userData;

  const fetchArticles = async () => {
    setLoading(true);
    let gNewsArticles = [];
    let indonesiaNewsArticles = [];
    let mediastackArticles = [];

    // Indonesia News API
    try {
      const indonesiaNewsResponse = await fetch(
        "https://indonesia-news.p.rapidapi.com/news/nasional",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "indonesia-news.p.rapidapi.com",
            "x-rapidapi-key":
              "4f926be992mshca25f6b55656adfp1afdadjsnb0950702295f",
          },
        }
      );

      console.log("Indonesia News Response:", indonesiaNewsResponse.status);
      const indonesiaNewsData = await indonesiaNewsResponse.json();
      console.log("Indonesia News Data:", indonesiaNewsData);

      if (indonesiaNewsData && indonesiaNewsData.data) {
        indonesiaNewsArticles = indonesiaNewsData.data.map((article) => ({
          title: article.title,
          description: article.description || article.contentSnippet || "",
          url: article.link || article.url,
          image: article.image || article.thumbnail,
          publishedAt: article.isoDate || article.pubDate,
          source: "Indonesia News",
          content: article.content || article.contentSnippet || "",
        }));
      }
    } catch (error) {
      console.error("Indonesia News API error:", error);
    }

    // GNews API
    try {
      const gNewsApiKey = "607638d0b716b0e20b4dd3a283af3524";
      const gNewsUrl = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=id&country=id&apikey=${gNewsApiKey}`;

      const gNewsResponse = await fetch(gNewsUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      });

      console.log("GNews Response:", gNewsResponse.status);
      const gNewsData = await gNewsResponse.json();
      console.log("GNews Data:", gNewsData);

      if (gNewsData && gNewsData.articles) {
        gNewsArticles = gNewsData.articles.map((article) => ({
          title: article.title,
          description: article.description || "",
          url: article.url,
          image: article.image
            ? article.image.replace("http://", "https://")
            : null,
          publishedAt: article.publishedAt,
          source: article.source?.name || "GNews",
          content: article.content || "",
        }));
      }
    } catch (error) {
      console.error("GNews API error:", error);
    }
    try {
      const mediastackResponse = await fetch(
        `http://api.mediastack.com/v1/news?access_key=3256324621887e7b8aeceb9ea1fc89ca&countries=id&limit=20&sort=published_desc&language=id`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!mediastackResponse.ok) {
        const errorData = await mediastackResponse.json();
        console.error("Mediastack API Error:", errorData);
        throw new Error(`Mediastack API Error: ${JSON.stringify(errorData)}`);
      }

      const mediastackData = await mediastackResponse.json();
      console.log("Mediastack Data:", mediastackData);
      console.log("Mediastack Data:", mediastackData);

      if (mediastackData && mediastackData.data) {
        mediastackArticles = mediastackData.data.map((article) => ({
          title: article.title,
          description: article.description || "",
          url: article.url,
          image: article.image,
          publishedAt: article.published_at,
          source: article.source || "Mediastack",
          content: article.description || "",
        }));
      }
    } catch (error) {
      console.error("Mediastack API error:", error);
    }

    // Combine and filter all articles
    const allArticles = [
      ...indonesiaNewsArticles,
      ...gNewsArticles,
      ...mediastackArticles,
    ].filter((article) => article.title && article.url);

    // Log article counts
    console.log("Total articles:", allArticles.length);
    console.log("Mediastack:", mediastackArticles.length);
    console.log("Indonesia News:", indonesiaNewsArticles.length);
    console.log("GNews:", gNewsArticles.length);

    setArticles(allArticles);
    setFilteredArticles(allArticles);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const categories = {
    business: "business",
    technology: "technology",
    health: "health",
    science: "science",
    sports: "sports",
    entertainment: "entertainment",
    world: "world",
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(
          "http://192.168.10.13:5000/api/bookmarks/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setBookmarkedArticles(
              data.data.map((bookmark) => ({
                _id: bookmark._id,
                title: bookmark.article.title,
                content: bookmark.article.content,
                image: bookmark.article.image,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching bookmark status:", error);
      }
    };

    fetchBookmarkStatus();
  }, []);

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

  const handleLike = async (article) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const response = await fetch(
        "http://192.168.10.13:5000/api/like-article",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            articleData: {
              title: article.title,
              description: article.description || "",
              content: article.content || "",
              image: article.image || article.urlToImage || "",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setLikedArticles((prev) =>
          data.liked
            ? [...prev, article]
            : prev.filter((a) => a.title !== article.title)
        );
      }
    } catch (error) {
      console.error("Error liking article:", error);
      Alert.alert("Error", "Failed to like article. Please try again later.");
    }
  };

  const handleBookmark = async (item) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const isBookmarked = bookmarkedArticles.some(
        (a) => a.title === item.title
      );

      if (isBookmarked) {
        const bookmark = bookmarkedArticles.find((a) => a.title === item.title);
        if (!bookmark || !bookmark._id) {
          throw new Error("Bookmark ID not found");
        }

        const response = await fetch(
          `http://192.168.10.13:5000/api/bookmarks/${bookmark._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setBookmarkedArticles((prev) =>
            prev.filter((a) => a.title !== item.title)
          );
        }
      } else {
        const response = await fetch(
          "http://192.168.10.13:5000/api/bookmarks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: item.title,
              content: item.description || item.content || "",
              image: item.urlToImage || item.image || "",
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          const newBookmark = {
            _id: data.bookmarkId,
            title: item.title,
            content: item.description || item.content || "",
            image: item.urlToImage || item.image || "",
          };
          setBookmarkedArticles((prev) => [...prev, newBookmark]);
        }
      }
    } catch (error) {
      console.error("Error bookmarking article:", error);
      Alert.alert("Error", "Failed to bookmark/unbookmark article");
    }
  };

  const navigateToLikedArticles = () => {
    navigation.navigate("LikedArticles");
  };

  const renderArticle = ({ item, index }) => {
    if (!item.title) return null;

    const placeholderImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

    const imageUrl = item.image || placeholderImage;

    return (
      <Animatable.View animation="fadeInUp" duration={1000} delay={index * 100}>
        <TouchableOpacity
          onPress={async () => {
            try {
              // Save to reading history before navigating
              const token = await AsyncStorage.getItem("userToken");
              if (token) {
                await fetch("http://192.168.10.13:5000/api/reading-history", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    article: {
                      title: item.title,
                      content: item.description || item.content || "",
                      image: item.urlToImage || item.image || "",
                      description: item.description || "",
                    },
                  }),
                });
              }
              navigation.navigate("ArticleDetail", { article: item });
            } catch (error) {
              console.error("Error saving reading history:", error);
              navigation.navigate("ArticleDetail", { article: item });
            }
          }}
        >
          <View style={styles.articleCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: imageUrl,
                  headers: {
                    "User-Agent": "Mozilla/5.0",
                    Accept: "image/jpeg,image/png,image/*;q=0.8",
                    "Cache-Control": "max-age=3600",
                  },
                }}
                style={styles.articleImage}
                onError={() => {
                  const updatedArticles = [...articles];
                  const articleIndex = updatedArticles.findIndex(
                    (a) => a.title === item.title
                  );
                  if (articleIndex !== -1) {
                    updatedArticles[articleIndex].image = placeholderImage;
                    setArticles(updatedArticles);
                  }
                }}
              />
            </View>
            <View style={styles.articleContentContainer}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.articleDescription} numberOfLines={3}>
                {item.description}
              </Text>
              <View style={styles.articleMetaContainer}>
                <Text style={styles.articleSource}>{item.source}</Text>
                <Text style={styles.articleMeta}>
                  {new Date(item.publishedAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(item)}
                >
                  <Icon
                    name={likedArticles.includes(item) ? "heart" : "heart-o"}
                    size={20}
                    color={likedArticles.includes(item) ? "#CC0000" : "#666"}
                  />
                  <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookmark(item)}
                >
                  <Icon
                    name={
                      bookmarkedArticles.find((a) => a.title === item.title)
                        ? "bookmark"
                        : "bookmark-o"
                    }
                    size={20}
                    color={
                      bookmarkedArticles.find((a) => a.title === item.title)
                        ? "#CC0000"
                        : "#666"
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

  const navigateToProfile = () => {
    navigation.navigate("Profile", { userData: userData });
  };

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
      <TouchableOpacity onPress={navigateToProfile}></TouchableOpacity>
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
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    imageContainer: {
      width: "100%",
      height: 200,
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
      overflow: "hidden",
    },
    articleImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    articleContentContainer: {
      padding: 12,
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 8,
    },
    articleDescription: {
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#666",
      marginBottom: 8,
    },
    articleMetaContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    articleSource: {
      fontSize: 12,
      fontWeight: "bold",
      color: isDarkMode ? "#999" : "#666",
    },
    articleMeta: {
      fontSize: 12,
      color: isDarkMode ? "#999" : "#888",
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
      padding: 8,
    },
    actionText: {
      marginLeft: 4,
      fontSize: 12,
      color: isDarkMode ? "#ccc" : "#666",
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    likedArticlesButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#333" : "#fff",
      padding: 8,
      borderRadius: 8,
      marginTop: 8,
    },
    likedArticlesText: {
      marginLeft: 8,
      color: "#CC0000",
      fontWeight: "bold",
    },
  });

export default HomeScreen;
