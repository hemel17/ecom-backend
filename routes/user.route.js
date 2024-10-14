const express = require("express");
const {
  createUser,
  getAllUsers,
  loginUser,
  getOneUser,
  deleteUser,
  updateUser,
  deleteAllUser,
  blockUser,
  unblockUser,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(getAllUsers).delete(deleteAllUser);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router
  .route("/:id")
  .get(authMiddleware, getOneUser)
  .put(authMiddleware, updateUser)
  .delete(authMiddleware, deleteUser);
router.route("/block-user/:id").put(authMiddleware, blockUser);
router.route("/unblock-user/:id").put(authMiddleware, unblockUser);

module.exports = router;
