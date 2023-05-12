const mongoose = require("mongoose");
const Room = require("../models/roomModel");
const Bed = require("../models/bedModel");
const Student = require("../models/studentModel");

const hostelSchema = new mongoose.Schema(
  {
    hostel_name: {
      type: String,
      required: [true, "Please Enter hostel Name "],
      unique: true,
    },
    hostel_type: {
      type: String,
      required: [true, "Please Enter hostel type "],
    },
    desc: {
      type: String,
      required: [true, "Please Enter Desc "],
    },
    capacity: {
      type: Number,
      required: [true, "Please Enter capacity of hostel "],
    },
    number_of_rooms: {
      type: Number,
      required: [true, "Please Enter no of rooms"],
    },
    availability: {
      type: Boolean,
      required: [true, "Please Enter availability"],
    },
    phone: {
      type: String,
      required: true,
    },

    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    beds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bed" }],
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// hostelSchema.pre("findByIdAndDelete", async function (next) {
//   try {
//     // Find all rooms in the hostel
//     const rooms = await Room.find({ hostel_id: this._id });

//     // Find all beds in the rooms
//     const beds = await Bed.find({
//       room_id: { $in: rooms.map((room) => room._id) },
//     });

//     // Find all students in the beds
//     const students = await Student.find({
//       bed_id: { $in: beds.map((bed) => bed._id) },
//     });

//     // Delete all students in the beds
//     await Student.deleteMany({ bed_id: { $in: beds.map((bed) => bed._id) } });

//     // Delete all beds in the rooms
//     await Bed.deleteMany({ room_id: { $in: rooms.map((room) => room._id) } });

//     // Delete all rooms in the hostel
//     await Room.deleteMany({ hostel: this._id });

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("Hostel", hostelSchema);
