const asyncHandler = require("express-async-handler");
const Enquiry = require("../models/enquiryModel");
const nodemailer = require("nodemailer");

exports.createEnquiry = asyncHandler(async (req, res) => {
  try {
    const { name, mobile, desc } = req.body;
    const enquiry = await Enquiry.create(req.body);
    // send email to admin with attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rechms1234@gmail.com", // replace with your email address
        pass: "tgcgjdvkeexnmcvp", // replace with your email password or app password
      },
    });

    const mailOptions = {
      from: "rechms1234@gmail.com", // replace with your email address
      to: "kumarijyotichouhan@gmail.com", // replace with the admin's email address
      subject: "Complaint By Student!",
      html: `
        <p>Name: ${name}</p>
        <p>Phone Number: ${mobile}</p>
        <p>Description: ${desc}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent successfully: " + info.response);
      }
    });
    res.status(201).json({ success: true, enquiry });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.status(200).json({ success: true, enquiries });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.getSingleEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.updateEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.updateEnquiryStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.deleteEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
