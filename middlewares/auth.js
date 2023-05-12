const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  } else {
    throw new Error(
      "Not authorised! please login to acesss the resources! no token"
    );
  }
  // const { token } = req.cookies;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(decoded);
      req.user = await User.findById(decoded.id);
      console.log(req.user);
      next();
    }
  } catch (error) {
    throw new Error(
      "Not authorised! please login to acesss the resources! no token"
    );
  }
  // console.log(token);

  // if (!token) {
  //   throw new Error("Not authorised! please login to acesss the resources!");
  // }
  // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // console.log(decoded.id);
});

exports.isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email: email });

  if (user.role === "admin") {
    next();
  } else {
    throw new Error(
      "Not authorised! You are not allowed to access this resource"
    );
  }
});
