import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

const translations = {
  en: {
    home: "Home",
    bookmarks: "Bookmarks",
    profile: "Profile",
    welcomeBack: "Welcome Back!",
    login: "Login",
    signUp: "Sign Up",
    createAccount: "Create Your Account",
    changePassword: "Change Password",
    languageLocation: "Language & Location",
    news: "News",
    searchNews: "Search news...",
    likedArticles: "Liked Articles",
    readingHistory: "Reading History",
    darkMode: "Dark Mode",
    logOut: "Log Out",
    yourActivities: "Your Activities",
    account: "Account",
    preferences: "Preferences",
    noBookmarks: "No bookmarks added yet.",
    noReadingHistory: "No reading history yet.",
    categories: {
      business: "Business",
      technology: "Technology",
      health: "Health",
      science: "Science",
      sports: "Sports",
    },
    languageChanged: "Language changed successfully",
  },
  id: {
    home: "Beranda",
    bookmarks: "Penanda",
    profile: "Profil",
    welcomeBack: "Selamat Datang Kembali!",
    login: "Masuk",
    signUp: "Daftar",
    createAccount: "Buat Akun Anda",
    changePassword: "Ubah Kata Sandi",
    languageLocation: "Bahasa & Lokasi",
    categories: {
      business: "Bisnis",
      technology: "Teknologi",
      health: "Kesehatan",
      science: "Ilmu Pengetahuan",
      sports: "Olahraga",
    },
    searchNews: "Cari berita...",
    likedArticles: "Artikel Disukai",
    readingHistory: "Riwayat Membaca",
    darkMode: "Mode Gelap",
    logOut: "Keluar",
    yourActivities: "Aktivitas Anda",
    account: "Akun",
    preferences: "Preferensi",
    noBookmarks: "Belum ada penanda yang ditambahkan.",
    languageChanged: "Bahasa berhasil diubah",
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        language,
        changeLanguage,
        translations: translations[language],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
