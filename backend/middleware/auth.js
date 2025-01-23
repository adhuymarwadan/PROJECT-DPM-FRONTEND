const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  try {
    console.log("Headers:", req.headers); // Debug log
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Received token:", token); // Debug log

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification error:", err);
        return res.status(403).json({ error: "Invalid token" });
      }
      console.log("Decoded token:", decoded); // Debug log
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

module.exports = { authenticateToken };
