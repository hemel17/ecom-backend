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

module.exports = { createUser };
