const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const { authenticateToken } = require("../middleware/auth");
const Article = require("../models/Article");
const Bookmark = require("../models/Bookmark");

// Debug route
router.get("/test", (req, res) => {
  res.json({ message: "Bookmark routes are working" });
});

// Get bookmarks
router.get("/bookmarks/user", authenticateToken, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.userId })
      .populate({
        path: "article",
        select: "title content image createdAt",
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookmarks.map((bookmark) => ({
        _id: bookmark._id,
        article: bookmark.article,
        createdAt: bookmark.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
      error: error.message,
    });
  }
});

// Create bookmark
router.post("/bookmarks", authenticateToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // First, create or find the article
    let article = await Article.findOne({
      title: title,
      content: content || "",
      image: image || "",
    });

    if (!article) {
      article = new Article({
        title,
        content: content || "",
        image: image || "",
      });
      await article.save();
    }

    // Check if bookmark already exists with exact title match
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      "article.title": title,
    }).populate("article");

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Article already bookmarked",
        bookmarkId: existingBookmark._id,
      });
    }

    // Create new bookmark
    const newBookmark = new Bookmark({
      user: userId,
      article: article._id,
    });

    await newBookmark.save();

    // Populate article details before sending response
    await newBookmark.populate("article");

    res.status(201).json({
      success: true,
      message: "Article bookmarked successfully",
      bookmarkId: newBookmark._id,
      article: {
        _id: article._id,
        title: article.title,
        content: article.content,
        image: article.image,
        createdAt: article.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create bookmark",
      error: error.message,
    });
  }
});

// Delete bookmark
router.delete("/bookmarks/:id", authenticateToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    res.json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove bookmark",
      error: error.message,
    });
  }
});

// Route untuk menyimpan artikel
router.post("/articles", authenticateToken, async (req, res) => {
  try {
    console.log("Received article data:", req.body); // Debug log
    const { title, content, image } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Cek apakah artikel sudah ada
    let article = await Article.findOne({ title });

    if (!article) {
      // Buat artikel baru jika belum ada
      article = new Article({
        title,
        content: content || "",
        image: image || "",
      });
      await article.save();
    }

    console.log("Saved article:", article); // Debug log

    res.status(201).json({
      success: true,
      articleId: article._id,
      message: "Article saved successfully",
    });
  } catch (error) {
    console.error("Error saving article:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save article",
      error: error.message,
    });
  }
});

module.exports = router;
