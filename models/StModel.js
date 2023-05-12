const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  parentContactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
    unique: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  bed_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed",
    required: true,
  },
  hostel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
  checkInDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  checkOutDate: {
    type: Date,
  },
  // whether a student is using the bed or not
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Before saving a new student, hash the password
studentsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentsSchema.methods.comparePassword = async function (Enteredpassword) {
  return await bcrypt.compare(Enteredpassword, this.password);
};

module.exports = mongoose.model("Stdnt", studentsSchema);
