const asyncHandler = require("express-async-handler");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const Hostel = require("../models/hostelModel");
const Room = require("../models/roomModel");

exports.uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log("file is ", req.files);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    // console.log(files);

    for (const file of Object.values(files)) {
      const { path } = file;
      // console.log(path);
      const newpath = await uploader(path);
      // console.log(newpath);
      urls?.push(newpath);
      fs.unlinkSync(path);
    }

    const hostel = await Hostel.findByIdAndUpdate(
      id,
      {
        photos: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );

    res.status(200).json({ success: true, urls });
  } catch (error) {
    throw new Error(error);
  }
});

exports.deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await cloudinaryDeleteImg(id, "images");
    res
      .status(200)
      .json({ success: true, message: " Image deleted successfully", deleted });
  } catch (error) {
    throw new Error(error);
  }
});

exports.uploadRoomImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //   console.log(req.files);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      //   console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }

    const room = await Room.findByIdAndUpdate(
      id,
      {
        images: urls?.map((file) => {
          return file;
        }),
      },
      { new: true }
    );

    res.status(200).json({ success: true, urls });
  } catch (error) {
    throw new Error(error);
  }
});
