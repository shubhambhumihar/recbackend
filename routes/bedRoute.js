const express = require("express");
const {
  createBed,
  getAllBed,
  getSingleBed,
  updateBed,
  deleteBed,
  bookBed,
  getStudentOfSingleBed,
} = require("../controllers/bedCntrl");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createBed);

router.route("/").get(getAllBed);
router.route("/:id").get(getSingleBed);
router.route("/:id/student").get(getStudentOfSingleBed);
router.route("/book-bed").post(bookBed);
router.route("/:id").put(isAuthenticated, isAdmin, updateBed);
router.route("/:id").delete(isAuthenticated, isAdmin, deleteBed);

module.exports = router;
