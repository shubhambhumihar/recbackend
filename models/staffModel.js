const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },
    images: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
