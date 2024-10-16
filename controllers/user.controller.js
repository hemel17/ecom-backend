const generateToken = require("../config/jwtToken");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbID");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

// * Create user
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });

  if (findUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});

// * Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  if (!findUser || !(await findUser.isPasswordMatched(password))) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const refreshToken = generateRefreshToken(findUser._id);

  await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });

  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    })
    .json({
      user: findUser,
      token: generateToken(findUser._id),
    });
});

// * Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// * Get one user
const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json(user);
});

// * Update user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json(updatedUser);
});

// * Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json({ message: "User deleted successfully", deletedUser });
});

// * Delete all users
const deleteAllUser = asyncHandler(async (req, res) => {
  const deleted = await User.deleteMany();
  res.status(200).json({ message: "All users deleted successfully", deleted });
});

// * Block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const blockedUser = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );

  if (!blockedUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json({
    message: "User blocked successfully.",
    user: blockedUser,
  });
});

// * Unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const unBlockedUser = await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );

  if (!unBlockedUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json({
    message: "User unblocked successfully.",
    user: unBlockedUser,
  });
});

// * refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookie");
  }
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("No refresh token found in db or not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) {
      throw new Error("Something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json(accessToken);
  });
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  deleteAllUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
};
