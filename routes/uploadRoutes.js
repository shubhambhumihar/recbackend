const express = require("express");

const { uploadPhoto, hostelImgResize } = require("../middlewares/uploadImages");
const {
  uploadImages,
  deleteImages,
} = require("../controllers/uploadController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();
console.log(isAuthenticated);

router
  .route("/")
  .post(
    uploadPhoto.any("images"),
    isAuthenticated,
    isAdmin,
    hostelImgResize,
    uploadImages
  );

router.route("/delete-img/:id").delete(isAuthenticated, isAdmin, deleteImages);

module.exports = router;
