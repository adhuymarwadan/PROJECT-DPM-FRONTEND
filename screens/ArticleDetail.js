import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "./ThemeContext"; // Import useTheme
import AsyncStorage from "@react-native-async-storage/async-storage";
const defaultAuthorImage = require("../assets/logo.png");

const defaultArticleImage = require("../assets/WHITEjpg.jpg"); // Add this line

const ArticleDetail = ({ route, navigation }) => {
  const { article } = route.params;
  const { isDarkMode, translations } = useTheme(); // Gunakan useTheme
  const [translatedContent, setTranslatedContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("auto"); // Tambahkan state untuk bahasa

  const articleData = {
    title: article?.title || "No Title",
    description: article?.description || article?.content || "",
    image: article?.image || article?.urlToImage,
    publishedAt:
      article?.publishedAt || article?.published_at || new Date().toISOString(),
    category: article?.category || "News",
    author: article?.author || "Anonymous",
    comments: article?.comments || 0,
  };
  // Daftar bahasa yang didukung (ditambah bahasa Indonesia, Rumania)
  const languages = {
    id: "Bahasa Indonesia",
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    pt: "Português",
    ru: "Русский",
    ja: "日本語",
    ko: "한국어",
    zh: "中文",
    ar: "العربية",
    hi: "हिन्दी",
    ms: "Bahasa Melayu",
    th: "ไทย",
    vi: "Tiếng Việt",
    nl: "Nederlands",
    tr: "Türkçe",
    ro: "Română",
  };

  const translateText = async (text) => {
    if (!text) return "";

    setIsTranslating(true);
    try {
      // Use HTTPS URL and add proper headers for iOS
      const encodedText = encodeURIComponent(text);
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${
          selectedLanguage === "auto" ? "auto" : selectedLanguage
        }|id`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Translation response:", data); // For debugging

      if (data.responseData) {
        if (
          data.responseData.translatedText === text &&
          selectedLanguage !== "auto"
        ) {
          // Fallback to auto detection if direct translation fails
          const retryResponse = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=auto|id`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0",
              },
            }
          );

          const retryData = await retryResponse.json();
          return {
            text: retryData.responseData?.translatedText || text,
            detectedLanguage:
              retryData.responseData?.detectedLanguage || selectedLanguage,
          };
        }
        return {
          text: data.responseData.translatedText,
          detectedLanguage:
            data.responseData.detectedLanguage || selectedLanguage,
        };
      }
      throw new Error("Invalid translation response");
    } catch (error) {
      console.error("Translation error:", error);
      Alert.alert(
        translations.alert.error,
        "Translation service is currently unavailable. Please try again later.",
        [{ text: "OK" }]
      );
      return { text: "", detectedLanguage: "" };
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = async () => {
    if (!showTranslation && !translatedContent) {
      const result = await translateText(article.description);
      if (result.text) {
        setTranslatedContent(result.text);
        // Jika bahasa terdeteksi otomatis, update selectedLanguage
        if (selectedLanguage === "auto" && result.detectedLanguage) {
          setSelectedLanguage(result.detectedLanguage);
        }
      }
    }
    setShowTranslation(!showTranslation);
  };

  useEffect(() => {
    const saveToReadingHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        await fetch("http://192.168.10.13:5000/api/reading-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            article: {
              title: article.title,
              content: article.content,
              description: article.description,
              image: article.image || article.urlToImage,
            },
          }),
        });
      } catch (error) {
        console.error("Error saving to reading history:", error);
      }
    };

    saveToReadingHistory();
  }, [article]);

  const styles = getStyles(isDarkMode); // Gunakan getStyles dengan isDarkMode

  console.log("Article data:", article); // Log untuk memeriksa data artikel

  // Add this near the top of your component to load the default author image

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            articleData.image ? { uri: articleData.image } : defaultArticleImage
          }
          style={styles.image}
          defaultSource={defaultArticleImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.category}>{articleData.category}</Text>
          <Text style={styles.title}>{articleData.title}</Text>
          <Text style={styles.meta}>
            {new Date(articleData.publishedAt).toLocaleDateString()} |{" "}
            {Math.ceil((articleData.description.length || 0) / 250)} min read
          </Text>
        </View>
      </View>

      <View style={styles.authorContainer}>
        <Image
          source={
            article.author_image
              ? { uri: article.author_image }
              : defaultAuthorImage
          }
          style={styles.authorImage}
        />
        <View>
          <Text style={styles.authorName}>{article.author || "AllNews "}</Text>
          <Text style={styles.commentCount}>
            {article.comments || 12} comments
          </Text>
        </View>
      </View>

      {/* Rest of your code remains the same */}
      {/* Language Selection */}
      <View style={styles.languageSelector}>
        <Text style={styles.languageLabel}>Pilih Bahasa Sumber:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.languageScroll}
        >
          {Object.entries(languages).map(([code, name]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.languageButton,
                selectedLanguage === code && styles.selectedLanguage,
              ]}
              onPress={() => {
                setSelectedLanguage(code);
                setTranslatedContent("");
                setShowTranslation(false);
              }}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  selectedLanguage === code && styles.selectedLanguageText,
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Translation Button */}
      <TouchableOpacity
        style={styles.translateButton}
        onPress={handleTranslate}
      >
        <Icon name="language" size={20} color={isDarkMode ? "#fff" : "#333"} />
        <Text style={styles.translateButtonText}>
          {showTranslation ? "Tampilkan Asli" : "Terjemahkan ke Indonesia"}
        </Text>
      </TouchableOpacity>

      {/* Article Content with Translation */}
      {isTranslating ? (
        <ActivityIndicator style={styles.loader} size="large" color="#CC0000" />
      ) : (
        <Text style={styles.content}>
          {showTranslation ? translatedContent : article.description}
        </Text>
      )}

      {/* Related Articles */}
      <View style={styles.relatedContainer}>
        <Text style={styles.relatedTitle}>
          Related in {article.category || "Tech"}
        </Text>
        <TouchableOpacity style={styles.relatedCard}>
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
    languageSelector: {
      padding: 16,
    },
    languageLabel: {
      fontSize: 14,
      color: isDarkMode ? "#ccc" : "#666",
      marginBottom: 8,
    },
    languageScroll: {
      flexDirection: "row",
      marginBottom: 16,
    },
    languageButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
      marginRight: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? "#444" : "#ddd",
    },
    selectedLanguage: {
      backgroundColor: "#CC0000",
      borderColor: "#CC0000",
    },
    languageButtonText: {
      color: isDarkMode ? "#fff" : "#333",
      fontSize: 14,
    },
    selectedLanguageText: {
      color: "#fff",
    },
    translateButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 8,
      justifyContent: "center",
    },
    translateButtonText: {
      marginLeft: 8,
      color: isDarkMode ? "#fff" : "#333",
      fontSize: 16,
      fontWeight: "bold",
    },
    loader: {
      padding: 20,
    },
  });

export default ArticleDetail;
