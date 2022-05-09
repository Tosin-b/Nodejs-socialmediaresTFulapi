const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute  = require("./routes/post")
var cors = require('cors')
const multer = require("multer");
const res = require("express/lib/response");
const app = express();
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );
  
 
//Middleware 
app.use(cors())
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute)

const storage = multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,"public/images")
  },
  filename: (req,file,cb) => {
    cb(null,req.body.name)
  },
})
const upload = multer(storage)
app.post("api/upload",upload.single("file"), (req,res)=>{
  try {
    return res.status(200).json("File uploaded Succesfully. ")
  } catch (error) {
    console.log(err)
  }
})
app.get("/", (req, res) => {
  res.send("Welcome to Homepage");
});

app.listen(8800, () => {
  console.log("Backend Server is Running!");
});
