const express = require("express");
const dotenv = require("dotenv");
const databaseConnect = require("./config/dbConnect");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/userRoute");
const hostelRouter = require("./routes/hostelRoute");
const roomRouter = require("./routes/roomRoutes");
const staffRouter = require("./routes/staffRoute");
const stdRouter = require("./routes/stdRoutes");
const bedRouter = require("./routes/bedRoute");
const bedRequestRouter = require("./routes/bedRequestRoute");
const contactRouter = require("./routes/contactRoute");
const uploadRouter = require("./routes/uploadRoutes");
const studentIdRouter = require("./routes/studentIdRoutes");
const enquiryRouter = require("./routes/enquiryRoutes");

const postRouter = require("./routes/postRoute");
const uploadSingleRouter = require("./routes/uploadSingleImgRoute");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
// const { fileURLToPath } = require("url");

const app = express();

//! configurations

// get file name and
const filename = path.resolve(__filename);
const dirname = path.dirname(filename);

// console.log(dirname);

dotenv.config();

mongoose.set("strictQuery", false);
databaseConnect();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/hostel", hostelRouter);
app.use("/api/v1/room", roomRouter);
// app.use("/api/v1/student", studnetRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/student", stdRouter);
app.use("/api/v1/bed", bedRouter);
app.use("/api/v1/enquiry", enquiryRouter);
app.use("/api/v1/bed-request", bedRequestRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/upload", uploadRouter);
// app.use("/api/v1/uploadImage", uploadImageRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/uploadImg", uploadSingleRouter);
app.use("/api/v1/studentId", studentIdRouter);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

module.exports = app;
