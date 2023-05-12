const StudentId = require("../models/StudentId");

const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validMongoDbId");

exports.createStudentid = asyncHandler(async (req, res) => {
  try {
    const studentId = await StudentId.create(req.body);
    res.status(201).json({ success: true, studentId });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.getAllStudentid = asyncHandler(async (req, res) => {
  try {
    const studentIds = await StudentId.find();
    res.status(200).json({ success: true, studentIds });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.getSingleStudentid = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = await StudentId.findById(id);
    res.status(200).json({ success: true, studentId });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.updateStudentid = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = await StudentId.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!studentId) throw new Error("Student id not found");
    res.status(200).json({ success: true, studentId });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.deleteStudentid = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = await StudentId.findByIdAndDelete(id);
    if (!studentId) throw new Error("Student id not found");
    res.status(200).json("Student id deleted successfully");
  } catch (error) {
    throw new Error(error.message);
  }
});
