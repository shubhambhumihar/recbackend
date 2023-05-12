const Bed = require("../models/bedModel");
const Room = require("../models/roomModel");
const Student = require("../models/studentModel");
const Hostel = require("../models/hostelModel");

const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validMongoDbId");

exports.createBed = asyncHandler(async (req, res) => {
  const { room_id, hostel } = req.body;
  try {
    const room = await Room.findById(room_id);
    // console.log(room.beds.length);
    // console.log(room.capacity);
    // cap=4

    // !NEED TO CORRECT
    if (room.beds.length <= room.capacity - 1) {
      const newBed = await Bed.create(req.body);
      try {
        await Room.findByIdAndUpdate(room_id, {
          $push: { beds: newBed._id },
        });

        await Hostel.findByIdAndUpdate(hostel, {
          $push: { beds: newBed._id },
        });
      } catch (error) {
        throw new Error(error.message);
      }
      res.status(201).json({ success: true, newBed });
    } else {
      res.status(500).json("You cant add more than 3 beds in a room!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllBed = asyncHandler(async (req, res) => {
  try {
    const count = await Bed.countDocuments({});
    const beds = await Bed.find().populate("student");
    res.status(200).json({ success: true, beds, count });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getSingleBed = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const bed = await Bed.findById(id).populate("student");
    if (!bed) {
      throw new Error(`Bed ${id} not found`);
    } else {
      res.status(200).json({ success: true, bed });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getStudentOfSingleBed = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const bed = await Bed.findById(id).populate({
      path: "student",
      populate: [
        {
          path: "hostel_id",
          model: "Hostel",
        },
        {
          path: "bed_id",
          model: "Bed",
        },
        {
          path: "room_id",
          model: "Room",
        },
      ],
    });
    const student = bed.student;
    if (!bed) {
      throw new Error(`Bed ${id} not found`);
    } else {
      res.status(200).json({ success: true, student });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.bookBed = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const { bedId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found.");
    }
    const bed = await Bed.findById(bedId);
    if (!bed) {
      throw new Error("Bed not found.");
    }
    if (bed.isOccupied) {
      throw new Error("This bed is already occupied or booked.");
    }
    bed.student = student._id;
    bed.isOccupied = true;
    await bed.save();
    res.status(200).json({ message: "Bed Booked Successfully!" });
  } catch (error) {
    throw error;
  }
});

exports.updateBed = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const bedToUpdate = await Bed.findById(id);

    if (!bedToUpdate) throw new Error("Bed not found");

    const bed = await Bed.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, bed });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.deleteBed = asyncHandler(async (req, res) => {
  // const bed_id = req.params.roomId;
  try {
    const bedId = req.params.id;
    validateMongoId(bedId);

    // Find the bed in the database
    const bed = await Bed.findByIdAndDelete(bedId);

    console.log(bed);
    // console.log(bed._id);

    if (!bed) throw new Error("Bed not found");

    // try {
    //   await Room.findByIdAndUpdate(room_id, { $pull: { beds: bed._id } });
    // } catch (error) {
    //   throw new Error(error.message);
    // }

    // await Room.findByIdAndUpdate(bed.room_id, {
    //   $pull: { beds: bed._id },
    // });

    await Room.findByIdAndUpdate(bed.room_id, {
      $pull: { beds: bed._id },
    });
    res
      .status(200)
      .json({ success: true, message: "Bed deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
