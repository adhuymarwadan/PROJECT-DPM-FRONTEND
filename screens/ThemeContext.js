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
    noBookmarks: "No bookmarked articles yet",
    noReadingHistory: "No reading history yet",
    categories: {
      business: "Business",
      technology: "Technology",
      health: "Health",
      science: "Science",
      sports: "Sports",
    },
    languageChanged: "Language changed successfully",
    allFieldsRequired: "Please fill in all fields",
    passwordsDoNotMatch: "New passwords do not match",
    notAuthenticated: "You are not authenticated",
    passwordChangedSuccess: "Password changed successfully",
    oldPasswordIncorrect: "Old password is incorrect",
    passwordChangeFailed: "Failed to change password",
    somethingWentWrong: "Something went wrong",
    noLikedArticles: "No liked articles yet",
    selectLanguage: "Select Language",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    oldPasswordPlaceholder: "Old Password",
    newPasswordPlaceholder: "New Password",
    confirmPasswordPlaceholder: "Confirm New Password",
    loginButton: "Login",
    signUpButton: "Sign Up",
    loggingIn: "Logging in...",
    dontHaveAccount: "Don't have an account? Sign Up",
    enterEmailPassword: "Please enter both email and password",
    connectionError:
      "Unable to connect to server. Please check your internet connection.",
    fillAllFields: "Please fill in all fields",
    accountCreated: "Account created successfully",
    signUpFailed: "Sign-up failed",
    somethingWrong: "Something went wrong",
    alert: {
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      ok: "OK",
      cancel: "Cancel",
      confirm: "Confirm",
      loginError: "Login Error",
      invalidCredentials: "Invalid email or password",
      connectionError: "Connection Error",
      networkError: "Please check your internet connection",
      changeLanguageTitle: "Change Language",
      changeLanguageMessage: "Are you sure you want to change the language?",
      languageChanged: "Language has been changed successfully",
      bookmarkAdded: "Article bookmarked successfully",
      bookmarkRemoved: "Article removed from bookmarks",
      translationError: "Failed to translate. Please try again later",
      logoutConfirm: "Are you sure you want to logout?",
      logoutSuccess: "Logged out successfully",
      deleteConfirm: "Are you sure you want to delete?",
      saveSuccess: "Saved successfully",
      updateSuccess: "Updated successfully",
    },
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
    selectLanguage: "Pilih Bahasa",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Kata Sandi",
    oldPasswordPlaceholder: "Kata Sandi Lama",
    newPasswordPlaceholder: "Kata Sandi Baru",
    confirmPasswordPlaceholder: "Konfirmasi Kata Sandi Baru",
    loginButton: "Masuk",
    signUpButton: "Daftar",
    loggingIn: "Sedang masuk...",
    dontHaveAccount: "Belum punya akun? Daftar",
    enterEmailPassword: "Mohon masukkan email dan kata sandi",
    connectionError:
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
    fillAllFields: "Mohon isi semua kolom",
    accountCreated: "Akun berhasil dibuat",
    signUpFailed: "Pendaftaran gagal",
    somethingWrong: "Terjadi kesalahan",
    news: "Berita",
    noReadingHistory: "Belum ada riwayat membaca",
    alert: {
      error: "Error",
      success: "Berhasil",
      warning: "Peringatan",
      info: "Informasi",
      ok: "OK",
      cancel: "Batal",
      confirm: "Konfirmasi",
      loginError: "Error Login",
      invalidCredentials: "Email atau password tidak valid",
      connectionError: "Error Koneksi",
      networkError: "Silakan periksa koneksi internet Anda",
      changeLanguageTitle: "Ubah Bahasa",
      changeLanguageMessage: "Apakah Anda yakin ingin mengubah bahasa?",
      languageChanged: "Bahasa berhasil diubah",
      bookmarkAdded: "Artikel berhasil disimpan ke bookmark",
      bookmarkRemoved: "Artikel dihapus dari bookmark",
      translationError: "Gagal menerjemahkan. Silakan coba lagi nanti",
      logoutConfirm: "Apakah Anda yakin ingin keluar?",
      logoutSuccess: "Berhasil keluar",
      deleteConfirm: "Apakah Anda yakin ingin menghapus?",
      saveSuccess: "Berhasil disimpan",
      updateSuccess: "Berhasil diperbarui",
    },
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
