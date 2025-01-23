const mongoose = require("mongoose");

const readingHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    title: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    description: { type: String },
  },
  readAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // 30 days in seconds
  },
});

module.exports = mongoose.model("ReadingHistory", readingHistorySchema);
