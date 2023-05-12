const express = require("express");
const {
  createRoom,
  getAllRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  bookRoom,
  getBedsOfRoom,
} = require("../controllers/roomCntrlr");
// const { uploadRoomImages } = require("../controllers/uploadController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
// const { uploadPhoto, roomImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createRoom);
// router.route("/upload/:id").put(
//   isAuthenticated,
//   isAdmin,
//   uploadPhoto.any("images"),
//   roomImgResize,

//   uploadRoomImages
// );

router.route("/").get(getAllRoom);
router.route("/:id").get(getSingleRoom);
router.route("/bed/:id").get(getBedsOfRoom);
router.route("/book-room").post(bookRoom);
router.route("/:id").put(isAuthenticated, isAdmin, updateRoom);
router.route("/:id").delete(isAuthenticated, isAdmin, deleteRoom);

module.exports = router;
