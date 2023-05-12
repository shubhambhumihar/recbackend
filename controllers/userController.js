const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const sendToken = require("../utils/sendJwtToken");
const { validateMongoId } = require("../utils/validMongoDbId");
// const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// var uniqid = require("uniqid");

exports.registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, mobile, picturePath, location } = req.body;

    if (!name || !email || !password || !mobile) {
      throw new Error("Please Enter all required fields");
    }

    const findUser = await User.findOne({ email: email });
    if (findUser) {
      throw new Error("User is already registered!");
    }

    const newUser = await User.create(req.body);

    sendToken(newUser, 201, res);
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new Error("User doesn't exist. Login first!");
  }
  // now check the password
  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  sendToken(user, 200, res);
});

exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email: email }).select("+password");
  if (admin.role !== "admin") {
    throw new Error("Not authorised!");
  }

  if (!admin) {
    throw new Error("User doesn't exist. Login first!");
  }

  const isValidPass = await admin.comparePassword(password);

  if (!isValidPass) {
    throw new Error("Invalid email or password!");
  }

  sendToken(admin, 200, res);
  // const admin = await User.findOne({ email: email });

  // if (admin.role !== "admin") {
  //   throw new Error("Not authorised");
  // }

  // if (!admin) {
  //   throw new Error("User doesn't exist. Login first!");
  // }
  // // now check the password
  // const isValidPassword = await admin.comparePassword(password);
  // if (!isValidPassword) {
  //   throw new Error("Invalid email or password");
  // }
  // sendToken(admin, 200, res);
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    throw new Error(error.message);
  }
});

// get a single user
exports.getSingleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    } else {
      res.status(200).json({ success: true, user });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// delete a user admin
exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    const user = await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
// delete my profile
exports.deletemyProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    validateMongoId(id);

    const user = await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "User profile deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});

// // update a user
exports.updateUser = asyncHandler(async (req, res) => {
  try {
    // const newUserData = {
    //   name: req?.body?.name,
    //   mobile: req?.body?.mobile,
    //   email: req?.body?.email,
    // };
    const { id } = req.user;
    validateMongoId(id);
    const userToUpdate = await User.findById(id);

    if (!userToUpdate) throw new Error("User not found");

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    throw new Error(error.message);
  }
});

// exports.saveAddress = asyncHandler(async (req, res, next) => {
//   const { _id } = req.user;
//   validateMongoId(_id);

//   try {
//     const user = await User.findByIdAndUpdate(
//       _id,
//       {
//         address: req?.body?.address,
//       },
//       {
//         new: true,
//       }
//     );
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// !Block User
// exports.blockUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoId(id);
//   try {
//     const finduser = await User.findById(id);
//     if (!finduser) throw new Error("User not found");
//     const user = await User.findByIdAndUpdate(
//       id,
//       { isBlocked: true },
//       { new: true, runValidators: true }
//     );

//     res
//       .status(200)
//       .json({ success: true, message: "User blocked successfully!" });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// !Unblockn User
// exports.unblockUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoId(id);
//   try {
//     const finduser = await User.findById(id);
//     if (!finduser) throw new Error("User not found");
//     const user = await User.findByIdAndUpdate(
//       id,
//       { isBlocked: false },
//       { new: true, runValidators: true }
//     );

//     res
//       .status(200)
//       .json({ success: true, message: "User unblocked successfully!" });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

exports.logout = asyncHandler(async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error.message);
  }
});
exports.logoutAdmin = asyncHandler(async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error.message);
  }
});

exports.updatePassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      throw new Error("passwords does not match");
    }
    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    throw new Error(error.message);
  }
});

// !GET USER DETAILS
exports.getUserDetail = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.status(200).json({ success: true, user });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// exports.forgotPassword = asyncHandler(async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // ! get reset password token
//   const resetToken = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   // sending message for the url to the email to resset the password
//   const resetPasswordUrl = `http://localhost:5000/api/v1/user/reset-password/${resetToken}`;

//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if You have not requested to reset your password then ignore this message and continue! This link is valid till 15 minutes from now...`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Fashion  cart password recovery",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (error) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     throw new Error(error.message);
//   }
// });

// Reset Password
// exports.resetPassword = asyncHandler(async (req, res) => {
//   console.log(req.params.token);
//   // creating token hash
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   console.log(hashedToken);
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     throw new Error("Reset Password Token is invalid or has been expired");
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     throw new Error("Password does not match");
//   }

//   user.password = req.body.password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;

//   await user.save();

//   sendToken(user, 200, res);
// });
