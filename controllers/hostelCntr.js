const Hostel = require("../models/hostelModel");
const Room = require("../models/roomModel");
const Bed = require("../models/bedModel");

const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validMongoDbId");

exports.createHostel = asyncHandler(async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json({ success: true, hostel });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllHostel = asyncHandler(async (req, res) => {
  try {
    const count = await Hostel.countDocuments({});
    const hostels = await Hostel.find().populate("rooms");
    res.status(200).json({ success: true, hostels, count });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getSingleHostel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    // !not working populate
    const hostel = await Hostel.findById(id).populate(["rooms", "beds"]);
    if (!hostel) {
      throw new Error(`Hostel ${id} not found`);
    } else {
      res.status(200).json({ success: true, hostel });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.updateHostel = asyncHandler(async (req, res) => {
  try {
    // const newHostelData = {
    //   name: req?.body?.name,
    //   mobile: req?.body?.mobile,
    //   email: req?.body?.email,
    // };
    const { id } = req.params;
    validateMongoId(id);
    const hostelToUpdate = await Hostel.findById(id);

    if (!hostelToUpdate) throw new Error("Hostel not found");

    const hostel = await Hostel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, hostel });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.deleteHostel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    const hostel = await Hostel.findByIdAndDelete(id);
    if (!hostel) throw new Error("Hostel not found");

    // await Room.deleteMany({ _id: { $in: hostel.rooms } }); // delete all associated rooms

    // await Bed.deleteMany({ _id: { $in: hostel.beds } }); // delete all associated beds

    res
      .status(200)
      .json({ success: true, message: "Hostel deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});

// !get all rooms of hostel
exports.getRoomsOfHostel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // const hostel = await Hostel.findById(id).populate("rooms");
    // const rooms = hostel.rooms;

    const rooms = await Room.find({ hostel_id: id }).populate("hostel_id");
    // console.log(hostel);
    // if (!hostel) {
    //   throw new Error(`Hostel ${id} not found`);
    // } else {
    res.status(200).json({ success: true, rooms });
    // }
  } catch (error) {
    throw new Error(error.message);
  }
});
// !get all beds of hostel
exports.getBedOfHostel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const hostel = await Hostel.findById(id).populate("beds");
    const beds = hostel.beds;

    res.status(200).json({ success: true, beds });
  } catch (error) {
    throw new Error(error.message);
  }
});
