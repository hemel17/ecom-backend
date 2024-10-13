const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } else {
    throw new Error("User already exists!");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.status(200).json(findUser);
  } else {
    throw new Error("Invalid credentials!");
  }
});

module.exports = { createUser, getAllUsers, loginUser };
