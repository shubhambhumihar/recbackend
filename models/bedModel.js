const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  bed_number: {
    type: Number,
    required: true,
    unique: true,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  // hostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stdnt",
    default: null,
  },
});

module.exports = mongoose.model("Bed", bedSchema);
