const Staff = require("../models/staffModel");

const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validMongoDbId");

exports.createStaff = asyncHandler(async (req, res) => {
  try {
    // const count = await Room.countDocuments({});
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, staff });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllStaffs = asyncHandler(async (req, res) => {
  try {
    const count = await Staff.countDocuments({});
    const staffs = await Staff.find();
    res.status(200).json({ success: true, staffs, count });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getSingleStaff = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const staff = await Staff.findById(id);
    if (!staff) {
      throw new Error(`staff ${id} not found`);
    } else {
      res.status(200).json({ success: true, staff });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.updateStaff = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const staffToUpdate = await Staff.findById(id);

    if (!staffToUpdate) throw new Error("Staff not found");

    const staff = await Staff.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, staff });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) throw new Error("Staff not found");

    res
      .status(200)
      .json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
