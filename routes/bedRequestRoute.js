const express = require("express");
const multer = require("multer");
const {
  bedRequest,
  getAllBedRequests,
  getAllPendingRequests,
  updateStatusOfBedRequest,
  getStudentBedRequest,
  deleteBedRequest,
} = require("../controllers/bedRequestCntrl");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Set up file filter for Multer
const fileFilter = function (req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

// Initialize Multer upload object
const upload = multer({ storage: storage, fileFilter: fileFilter });

router
  .route("/")
  .post(isAuthenticated, upload.single("allotmentLetter"), bedRequest);

router.route("/").get(isAuthenticated, getAllBedRequests);

router.route("/pending").get(isAuthenticated, getAllPendingRequests);

router
  .route("/:id/update-status")
  .put(isAuthenticated, updateStatusOfBedRequest);
router.route("/:id").delete(isAuthenticated, deleteBedRequest);

router.route("/student-bed-request").get(isAuthenticated, getStudentBedRequest);

module.exports = router;
