const express = require("express");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const {
  createStudentid,
  getAllStudentid,
  getSingleStudentid,
  updateStudentid,
  deleteStudentid,
} = require("../controllers/studentIdCntrlr");

const router = express.Router();

router.route("/").post(isAuthenticated, isAdmin, createStudentid);

router.route("/").get(isAuthenticated, isAdmin, getAllStudentid);

router.route("/:id").get(isAuthenticated, isAdmin, getSingleStudentid);
router.route("/:id").put(isAuthenticated, isAdmin, updateStudentid);
router.route("/:id").delete(isAuthenticated, isAdmin, deleteStudentid);

module.exports = router;
