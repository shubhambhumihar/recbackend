const express = require("express");

const {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  getStudentByBatch,
} = require("../controllers/studentCntrl");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(isAuthenticated, isAdmin, createStudent);

router.route("/").get(getAllStudents);

router.route("/:id").get(getSingleStudent);
router.route("/:id").put(updateStudent);
router.route("/:id").delete(deleteStudent);
router.route("/batch/:batch").get(getStudentByBatch);

module.exports = router;
