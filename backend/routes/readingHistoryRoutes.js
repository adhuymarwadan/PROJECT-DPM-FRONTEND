const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const ReadingHistory = require("../models/ReadingHistory");

// Get reading history
router.get("/reading-history", authenticateToken, async (req, res) => {
  try {
    const history = await ReadingHistory.find({ user: req.user.userId }).sort({
      readAt: -1,
    });

    res.json({
      success: true,
      readingHistory: history,
    });
  } catch (error) {
    console.error("Error fetching reading history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reading history",
    });
  }
});

// Add to reading history
router.post("/reading-history", authenticateToken, async (req, res) => {
  try {
    const { article } = req.body;
    const userId = req.user.userId;

    // Check if article already exists in history
    const existingEntry = await ReadingHistory.findOne({
      user: userId,
      "article.title": article.title,
    });

    if (existingEntry) {
      // Update readAt timestamp
      existingEntry.readAt = new Date();
      await existingEntry.save();
    } else {
      // Create new entry
      const newEntry = new ReadingHistory({
        user: userId,
        article: {
          title: article.title,
          content: article.content || article.description,
          image: article.image || article.urlToImage,
          description: article.description,
        },
      });
      await newEntry.save();
    }

    res.status(201).json({
      success: true,
      message: "Added to reading history",
    });
  } catch (error) {
    console.error("Error adding to reading history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to reading history",
    });
  }
});

module.exports = router;
