const Room = require("../models/roomModel");
const Hostel = require("../models/hostelModel");
const Bed = require("../models/bedModel");
// const Bed = require("../models/studentModel");

const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validMongoDbId");

exports.createRoom = asyncHandler(async (req, res) => {
  const { hostel_id } = req.body;
  try {
    const newRoom = await Room.create(req.body);

    try {
      await Hostel.findByIdAndUpdate(hostel_id, {
        $push: { rooms: newRoom._id },
      });
    } catch (error) {
      throw new Error(error.message);
    }
    res.status(201).json({ success: true, newRoom });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllRoom = asyncHandler(async (req, res) => {
  try {
    const count = await Room.countDocuments({});
    const rooms = await Room.find().populate(["occupants", "hostel_id"]);
    res.status(200).json({ success: true, rooms, count });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getSingleRoom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const room = await Room.findById(id);
    if (!room) {
      throw new Error(`Room ${id} not found`);
    } else {
      res.status(200).json({ success: true, room });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.getBedsOfRoom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const room = await Room.findById(id).populate("beds");
    const beds = room.beds;
    if (!room) {
      throw new Error(`Room ${id} not found`);
    } else {
      res.status(200).json({ success: true, beds });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.updateRoom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { hostel_id } = req.body;

    console.log(req.body);
    validateMongoId(id);
    const roomToUpdate = await Room.findById(id);

    if (!roomToUpdate) throw new Error("Room not found");

    // Check if the hostel ID has changed
    if (roomToUpdate.hostel_id.toString() !== hostel_id) {
      // Find the old hostel by ID
      const oldHostel = await Hostel.findById(roomToUpdate.hostel_id);
      // if (!oldHostel) {
      //   return res.status(404).json({ error: "Old hostel not found" });
      // }

      // Remove the room from the old hostel's rooms array
      oldHostel.rooms = oldHostel.rooms.filter(
        (roomId) => roomId.toString() !== roomToUpdate._id.toString()
      );

      // Save the old hostel to the database
      await oldHostel.save();
    }

    const room = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    const hostel = await Hostel.findById(hostel_id);
    if (!hostel.rooms.includes(room._id)) {
      hostel.rooms.push(room._id);
    }
    await hostel.save();
    // console.log(hostel);

    res.status(200).json({ success: true, room });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.bookRoom = asyncHandler(async (req, res) => {
  try {
    // Get the room ID from the request body
    const { roomId } = req.body;

    // Find the room by its ID
    const room = await Room.findById(roomId);

    // Check if the room is already booked
    if (room.isBooked) {
      // If the room is already booked, send an error response
      return res.status(400).json({ message: "This room is already booked." });
    }

    // If the room is not booked, update the isBooked property to true
    room.isBooked = true;

    // Save the updated room object to the database
    await room.save();

    // Send a success response
    res.status(200).json({ message: "Room booked successfully." });
  } catch (error) {
    // If there's an error, send an error response
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

exports.deleteRoom = asyncHandler(async (req, res) => {
  try {
    // Get the ID of the room to be deleted from the request parameters
    const roomId = req.params.id;

    // Find the room in the database
    const room = await Room.findByIdAndDelete(roomId);

    // Check if the room exists
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove the room from the hostel that it was linked to
    await Hostel.findByIdAndUpdate(room.hostel_id, {
      $pull: { rooms: room._id },
    });

    // await Bed.deleteMany({ _id: { $in: room.beds } }); // delete all associated beds
    // await Student.deleteMany({ _id: { $in: room.occupants } }); // delete all associated student

    // Send a success response to the client
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
