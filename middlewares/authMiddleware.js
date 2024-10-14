const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
};

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "No token found!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Login again." });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "User not authenticated." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You're not an admin!" });
  }

  next();
});

module.exports = { authMiddleware };
