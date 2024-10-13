const express = require("express");
const {
  createUser,
  getAllUsers,
  loginUser,
  getOneUser,
  deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getOneUser).delete(deleteUser);

module.exports = router;
