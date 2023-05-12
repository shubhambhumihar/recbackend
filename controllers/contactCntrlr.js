const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const nodemailer = require("nodemailer");

exports.createContact = asyncHandler(async (req, res) => {
  try {
    const { name, email, desc } = req.body;
    if (!name || !email || !desc) {
      res.status(304).json({ message: "Please enter all field" });
    }
    const contact = await Contact.create(req.body);
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
      subject: "Someone want to contact!",
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
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
    res.status(201).json({ success: true, contact });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllContact = asyncHandler(async (req, res) => {
  try {
    const count = await Contact.countDocuments({});
    const contacts = await Contact.find();
    res.status(200).json({ success: true, contacts, count });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getSingleContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      res.status(500).json({ message: "Contact not found!!" });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.deleteSingleContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      res.status(500).json({ message: "Contact not found!!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.updateSingleContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      res.status(500).json({ message: "Contact not found" });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    throw new Error(error.message);
  }
});
