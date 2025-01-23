const Bookmark = require("../models/Bookmark");
const Article = require("../models/Article");

const bookmarkController = {
  // Get user bookmarks
  getUserBookmarks: async (req, res) => {
    try {
      console.log("Processing getUserBookmarks");
      console.log("User from token:", req.user);

      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found in token",
        });
      }

      const bookmarks = await Bookmark.find({ user: userId })
        .populate({
          path: "article",
          select: "_id title image createdAt content",
        })
        .sort({ createdAt: -1 });

      console.log("Found bookmarks:", bookmarks);

      res.status(200).json({
        success: true,
        data: bookmarks,
      });
    } catch (error) {
      console.error("Error in getUserBookmarks:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookmarks",
        error: error.message,
      });
    }
  },

  // Add bookmark
  addBookmark: async (req, res) => {
    try {
      const { articleId } = req.body;
      const userId = req.user.userId;

      // Check if already bookmarked
      const existingBookmark = await Bookmark.findOne({
        user: userId,
        article: articleId,
      });

      if (existingBookmark) {
        return res.status(400).json({
          success: false,
          message: "Article already bookmarked",
        });
      }

      const newBookmark = new Bookmark({
        user: userId,
        article: articleId,
      });

      await newBookmark.save();

      res.status(201).json({
        success: true,
        message: "Article bookmarked successfully",
      });
    } catch (error) {
      console.error("Error in addBookmark:", error);
      res.status(500).json({
        success: false,
        message: "Failed to bookmark article",
      });
    }
  },

  // Remove bookmark
  removeBookmark: async (req, res) => {
    try {
      const bookmarkId = req.params.id;
      const userId = req.user.userId;

      const bookmark = await Bookmark.findOneAndDelete({
        _id: bookmarkId,
        user: userId,
      });

      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: "Bookmark not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Bookmark removed successfully",
      });
    } catch (error) {
      console.error("Error in removeBookmark:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove bookmark",
      });
    }
  },
};

module.exports = bookmarkController;
