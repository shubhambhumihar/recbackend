const mongoose = require("mongoose");

const studentIdSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "password",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentId", studentIdSchema);
