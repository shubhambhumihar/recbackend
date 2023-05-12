const express = require("express");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const {
  createEnquiry,
  getAllEnquiry,
  getSingleEnquiry,
  deleteEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
} = require("../controllers/equiryCntrlr");

const router = express.Router();

router.route("/").post(isAuthenticated, createEnquiry);
router.route("/").get(isAuthenticated, getAllEnquiry);
router.route("/:id").get(isAuthenticated, getSingleEnquiry);
router.route("/:id").put(isAuthenticated, updateEnquiry);
router.route("/:id/updateStatus").put(isAuthenticated, updateEnquiryStatus);
router.route("/:id").delete(isAuthenticated, deleteEnquiry);

module.exports = router;
