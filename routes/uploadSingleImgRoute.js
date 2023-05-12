const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  //   fileFilter: multerFilter,
  //   limits: { fileSize: 2000000 },
});

// router.route("/").post(
//   upload.single("file", (req, res) => {
//     try {
//       return res.status(200).json("file uploaded successfully");
//     } catch (error) {
//       console.log(error.message);
//     }
//   })
// );

// router.post("/", (req, res) => {
//   res.status(200).json("Nice");
// });

router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("file uploaded successfully");
  } catch (error) {
    console.log(error.message);
  }
});

// router.post(
//   "/",
//   upload.single("file", (req, res) => {
//     try {
//       return res.status(200).json("file uploaded successfully");
//     } catch (error) {
//       console.log(error.message);
//     }
//   })
// );

// router.post(
//   "/",
//   upload.single("file", (req, res) => {
//     try {
//       return res.status(200).json("file uploaded successfully");
//     } catch (error) {
//       console.log(error.message);
//     }
//   })
// );

module.exports = router;
