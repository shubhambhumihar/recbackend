const BedRequest = require("../models/bedRequestModel");
// const Room = require("../models/room");
const nodemailer = require("nodemailer");
const multer = require("multer");
const asyncHandler = require("express-async-handler");

exports.bedRequest = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobile, student_id, hostel_id, room_id } = req.body;
    // console.log(req.file);
    const newBedRequest = new BedRequest({
      name,
      email,
      mobile,
      student_id,
      hostel_id,
      room_id,
      allotmentLetter: req.file.path, // save the file path in the database
    });
    await newBedRequest.save();

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
      subject: "New bed request submitted",
      html: `
        <p>Student Name: ${name}</p>
        <p>Room Preference: ${room_id}</p>
        <p>Email: ${email}</p>
        <p>Mobile: ${mobile}</p>
      `,
      attachments: [
        {
          filename: "allotment-letter.pdf", // replace with the file name of the allotment letter
          path: req.file.path, // use the path of the uploaded file
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).send("Bed request submitted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting bed request");
  }
});

exports.getAllBedRequests = asyncHandler(async (req, res) => {
  try {
    const count = await BedRequest.countDocuments({});
    const totalBedRequests = await BedRequest.find().populate([
      "hostel_id",
      "room_id",
    ]);
    res.status(200).json({ success: true, totalBedRequests, count });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllPendingRequests = asyncHandler(async (req, res) => {
  try {
    const bedRequests = await BedRequest.find({ status: "pending" });

    res.status(200).json({ success: true, bedRequests });
  } catch (error) {
    throw new Error(error.message);
  }
});

// UPdate the request of bed
exports.updateStatusOfBedRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const bedRequest = await BedRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Updated successfully", bedRequest });
  } catch (error) {
    throw new Error(error.message);
  }
});
// UPdate the request of bed
exports.deleteBedRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const bedRequest = await BedRequest.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.getStudentBedRequest = asyncHandler(async (req, res) => {
  const studentId = req.user.student_id;
  console.log(studentId);
  if (!studentId)
    res
      .status(404)
      .json({ success: false, message: "Please Login as a Student!" });

  try {
    const bedRequest = await BedRequest.find({ student_id: studentId });
    res.status(200).json(bedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
