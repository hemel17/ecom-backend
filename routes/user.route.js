const express = require("express");
const {
  createUser,
  getAllUsers,
  loginUser,
  getOneUser,
  deleteUser,
  updateUser,
  deleteAllUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.route("/").get(getAllUsers).delete(deleteAllUser);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = router;
