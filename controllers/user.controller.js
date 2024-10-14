const generateToken = require("../config/jwtToken");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

// * create user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  try {
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.status(200).json(newUser);
    } else {
      throw new Error("User already exists!");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// * login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  try {
    if (findUser && (await findUser.isPasswordMatched(password))) {
      res.status(200).json({
        name: findUser?.name,
        email: findUser?.email,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// * get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

// * get one user
const getOneUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// * update user
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body.name,
        email: req?.body.email,
      },
      {
        new: true,
      }
    );
    res.send(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// * delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// * delete all user
const deleteAllUser = asyncHandler(async (req, res) => {
  const deleted = await User.deleteMany();
  res.send(deleted);
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  deleteAllUser,
};
