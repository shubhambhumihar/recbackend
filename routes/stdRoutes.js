const express = require("express");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const {
  createStd,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  loginAsStudent,
  searchStudent,
  test,
  getStudents,
} = require("../controllers/stCntrlr");

const router = express.Router();

router.route("/").post(isAuthenticated, isAdmin, createStd);

router.route("/").get(isAuthenticated, getAllStudents);
router.route("/search").get(isAuthenticated, isAdmin, getStudents);

router.route("/loginAsStudent").post(isAuthenticated, loginAsStudent);

router.route("/:id").get(isAuthenticated, isAdmin, getSingleStudent);

router.route("/:id").put(isAuthenticated, isAdmin, updateStudent);

router.route("/:id").delete(isAuthenticated, isAdmin, deleteStudent);

module.exports = router;
