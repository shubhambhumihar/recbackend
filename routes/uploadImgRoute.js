// const express = require("express");

// const {
//   uploadImages,
//   deleteImages,
// } = require("../controllers/uploadController");
// const { isAuthenticated, isAdmin } = require("../middlewares/auth");
// const { uploadPhoto } = require("../middlewares/uploadImages");

// const router = express.Router();
// console.log(isAuthenticated);

// router.route("/").post(
//   uploadPhoto.any("images"),
//   isAuthenticated,

//   uploadImages
// );

// router.route("/delete-img/:id").delete(isAuthenticated, isAdmin, deleteImages);

// // router.route("/delete-img/:id").delete(deleteImages);

// module.exports = router;
