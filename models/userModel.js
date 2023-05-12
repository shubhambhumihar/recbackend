const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false, //it will not come in response
    },
    mobile: {
      type: String,
      required: [true, "Please enter a mobile number"],
      unique: true,
    },
    picturePath: {
      type: String,
      default: "",
    },
    coverPicture: String,

    role: {
      type: String,
      default: "user",
    },
    isStudent: {
      type: Boolean,
      default: false,
    },
    student_id: {
      type: String,
    },
    occupation: String,
    location: String,

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// generate JWTTOKEN
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (Enteredpassword) {
  return await bcrypt.compare(Enteredpassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
