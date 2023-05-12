const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  logout,
  updatePassword,
  getUserDetail,
  loginAdmin,
  deletemyProfile,
  logoutAdmin,
} = require("../controllers/userController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { uploadPhoto } = require("../middlewares/uploadImages");

const router = express.Router();

// Routes with file
router.route("/register").post(uploadPhoto.single("picture"), registerUser);

router.route("/login").post(loginUser);
router.route("/admin-login").post(loginAdmin);

router.route("/logout").get(logout);
router.route("/logout-admin").get(logoutAdmin);

router.route("/profile").get(isAuthenticated, getUserDetail);
router.route("/profile-delete").delete(isAuthenticated, deletemyProfile);

router.route("/password").put(isAuthenticated, updatePassword);

//! admin
router.route("/allusers").get(getAllUsers);
router
  .route("/:id")
  .get(isAuthenticated, isAdmin, getSingleUser)
  .delete(isAuthenticated, isAdmin, deleteUser);

router.route("/update-user").put(isAuthenticated, updateUser);

module.exports = router;
