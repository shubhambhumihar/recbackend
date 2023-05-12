const mongoose = require("mongoose");
// const Hostel = require("../models/hostelModel");
const Bed = require("../models/bedModel");
const Student = require("../models/studentModel");

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  roomNumber: { type: Number, required: true, unique: true },
  numberOfBeds: { type: Number, required: true },
  description: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  capacity: {
    type: Number,
    required: true,
  },
  isBooked: { type: Boolean, default: false },
  hostel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
  images: [],
  beds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bed" }],
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stdnt" }],

  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

// Define pre middleware for room schema to cascade delete beds and occupants
// roomSchema.pre("findByIdAndDelete", async function (next) {
//   try {
//     const room = this;
//     await Bed.deleteMany({ room_id: room._id }); // delete all associated beds
//     await Student.deleteMany({ room_id: room._id }); // delete all associated student
//     next();
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

module.exports = mongoose.model("Room", roomSchema);

//   bookings: [
//     {
//       guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest" },
//       checkInDate: { type: Date, required: true },
//       checkOutDate: { type: Date, required: true },
//     },
//   ],
