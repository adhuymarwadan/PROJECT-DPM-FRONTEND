const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const Like = require("../models/Like");
const Article = require("../models/Article");

// Get user's liked articles
router.get("/liked-articles", authenticateToken, async (req, res) => {
  try {
    const likes = await Like.find({ user: req.user.userId })
      .populate({
        path: "article",
        select: "title content image createdAt",
      })
      .sort({ createdAt: -1 });

    const likedArticles = likes.map((like) => like.article);
    res.json({ success: true, likedArticles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle like article
router.post("/like-article", authenticateToken, async (req, res) => {
  try {
    const { articleData } = req.body;
    const userId = req.user.userId;

    // Create or find article
    let article = await Article.findOne({ title: articleData.title });
    if (!article) {
      article = new Article({
        title: articleData.title,
        content: articleData.description || articleData.content || "",
        image: articleData.image || articleData.urlToImage || "",
      });
      await article.save();
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      article: article._id,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      res.json({ success: true, liked: false });
    } else {
      const newLike = new Like({
        user: userId,
        article: article._id,
      });
      await newLike.save();
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
