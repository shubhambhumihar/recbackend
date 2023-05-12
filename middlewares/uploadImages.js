const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

//! create storage - > first we are storing files in our local and then atlast we will store in cloudinary
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(__dirname, "../public/images/")); //older
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    // const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg"); //older
    cb(null, file.originalname);
  },
});

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb({ message: "Unsupported file format" }, false);
//   }
// };

//!2 setup the multer
const uploadPhoto = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
  // limits: { fileSize: 2000000 },
});

const hostelImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/hostels/${file.filename}`);
      fs.unlinkSync(`public/images/hostels/${file.filename}`);
    })
  );
  next();
};

const roomImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/rooms/${file.filename}`);
      fs.unlinkSync(`public/images/rooms/${file.filename}`);
    })
  );
  next();
};
module.exports = { uploadPhoto, hostelImgResize, roomImgResize };
