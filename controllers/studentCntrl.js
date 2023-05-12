const Student = require("../models/studentModel");
const Room = require("../models/roomModel");
const Bed = require("../models/bedModel");

const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validMongoDbId");

// exports.createStudent = asyncHandler(async (req, res) => {
//   const { hostel_id, room_id, bed_id } = req.body;
//   try {
//     // const room = await Room.findById(room_id);

//     // !TO CORRECT
//     // if (room.capacity <= room.occupants.length) {
//     //   room.isBooked = true;
//     //   throw new Error("U have reached max limit of this room! ");
//     // }

//     // const bed = await Bed.findById(bed_id);

//     // if (!bed.isAvailable) {
//     //   throw new Error("This bed is already assigned to a student");
//     // }

//     const student = await Student.create(req.body);

//     //! search room by id and update student into that room
//     // try {
//     //   await Room.findByIdAndUpdate(room_id, {
//     //     $push: { occupants: student._id },
//     //   });
//     // } catch (error) {
//     //   throw new Error(error.message);
//     // }
//     // try {
//     //   // await Bed.findByIdAndUpdate(bed_id, {
//     //   //   $push: { student: student._id },
//     //   // });
//     //   await Bed.findByIdAndUpdate(bed_id, {
//     //     $set: { isAvailable: false, student: student._id },
//     //   });
//     // } catch (error) {
//     //   throw new Error(error.message);
//     // }
//     res.status(201).json({ success: true, student });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

exports.createStudent = asyncHandler(async (req, res) => {
  // const {hostel_id,room_id,bed_id}=req.body;
  try {
    const student = await Student.create(req.body);
    return res.status(201).json(student);
  } catch (error) {
    throw new Error(error.message);
  }
});

// exports.getAllStudents = asyncHandler(async (req, res) => {
//   try {
//     const count = await Student.countDocuments({});
//     const students = await Student.find();
//     res.status(200).json({ success: true, students, count });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// exports.getSingleStudent = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     validateMongoId(id);
//     const student = await Student.findById(id);
//     if (!student) {
//       throw new Error(`Student ${id} not found`);
//     } else {
//       res.status(200).json({ success: true, student });
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// exports.updateStudent = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     validateMongoId(id);
//     const studentToUpdate = await Student.findById(id);

//     if (!studentToUpdate) throw new Error("Student not found");

//     const student = await Student.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({ success: true, student });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// exports.deleteStudent = asyncHandler(async (req, res) => {
//   const room_id = req.params.roomId;
//   try {
//     const { id } = req.params;
//     validateMongoId(id);

//     const student = await Student.findByIdAndDelete(id);
//     if (!student) throw new Error("Student not found");
//     //! search room by id and update student into that room

//     try {
//       await Room.findByIdAndUpdate(room_id, {
//         $pull: { occupants: student._id },
//       });
//     } catch (error) {
//       throw new Error(error.message);
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Student deleted successfully" });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// exports.getStudentByBatch = asyncHandler(async (req, res) => {
//   try {
//     const { batch } = req.params;
//     console.log(batch);
//     // validateMongoId(id);

//     const students = await Student.find({ batch });
//     if (!students) throw new Error("Student not found");

//     res.status(200).json({ success: true, students });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });
