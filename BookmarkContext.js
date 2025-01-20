import React, { createContext, useState, useContext } from "react";

// Membuat Context
const BookmarkContext = createContext();

// Provider untuk BookmarkContext
export const BookmarkProvider = ({ children }) => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  // Menambahkan atau menghapus artikel dari bookmark
  const toggleBookmark = (article) => {
    setBookmarkedArticles((prevBookmarks) => {
      const isBookmarked = prevBookmarks.some((a) => a.title === article.title);
      if (isBookmarked) {
        return prevBookmarks.filter((a) => a.title !== article.title);
      } else {
        return [...prevBookmarks, article];
      }
    });
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedArticles, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

// Custom Hook
export const useBookmark = () => useContext(BookmarkContext);
