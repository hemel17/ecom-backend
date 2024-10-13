const express = require("express");
const {
  createUser,
  getAllUsers,
  loginUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);

module.exports = router;
