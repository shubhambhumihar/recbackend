const express = require("express");
const {
  createStaff,
  getAllStaffs,
  getSingleStaff,
  deleteStaff,
  updateStaff,
} = require("../controllers/staffController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createStaff);

router.route("/").get(getAllStaffs);

router.route("/:id").get(getSingleStaff);
router.route("/:id").put(isAuthenticated, isAdmin, updateStaff);
router.route("/:id").delete(isAuthenticated, isAdmin, deleteStaff);
// router.route("/batch/:batch").get(getStudentByBatch);

module.exports = router;
