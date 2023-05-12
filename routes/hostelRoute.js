const express = require("express");
const {
  createHostel,
  getAllHostel,
  getSingleHostel,
  updateHostel,
  deleteHostel,
  getRoomsOfHostel,
  getBedOfHostel,
} = require("../controllers/hostelCntr");
// const { uploadHostelImages } = require("../controllers/uploadController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
// const { uploadPhoto, hostelImgResize } = require("../middlewares/uploadImages");
// const { uploadPhoto, hostelImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createHostel);
// router.route("/upload/:id").put(
//   isAuthenticated,
//   isAdmin,
//   uploadPhoto.any("images"),
//   hostelImgResize,
//   // uploadPhoto.array("images", 10),

//   uploadHostelImages
// );

router.route("/").get(getAllHostel);
router.route("/room/:id").get(getRoomsOfHostel);
router.route("/bed/:id").get(getBedOfHostel);
router.route("/:id").get(getSingleHostel);
router.route("/:id").put(isAuthenticated, isAdmin, updateHostel);
router.route("/:id").delete(isAuthenticated, isAdmin, deleteHostel);

module.exports = router;
