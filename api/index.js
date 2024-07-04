const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "vavvIUIUib98YBUJUBUBbbo";

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGODB_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

//Register API
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json({ errors: e });
  }
});

//Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    console.log(userDoc);

    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (error, token) => {
            if (error) throw error;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        throw "Incorrect Password";
      }
    } else {
      throw "User not found";
    }
    //res.json(userDoc);
  } catch (e) {
    res.status(442).json({ erros: e });
  }
});

//Profile API
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      const { id } = userData;
      const { _id, name, email } = await User.findById(id);
      res.json({ _id, name, email });
    });
  } else {
    res.json(null);
  }
});

//Logout API
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//Photo Upload by Link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

//Photo Upload From System
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFilesPaths = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    let newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFilesPaths.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFilesPaths);
});

//Add New Place
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      const { id } = userData;
      try {
        const placeDoc = await Place.create({
          owner: id,
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
        });
        res.json(placeDoc);
      } catch (error) {
        res.json(error);
      }
    });
  }
});

//Get Places
app.get("/places", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      const { id } = userData;
      res.json(await Place.find({ owner: id }));
    });
  }
});

//Get Specific place
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

//Updated Places
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        try {
          placeDoc.set({
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
          });

          res.json(await placeDoc.save());
        } catch (error) {
          res.json(error);
        }
      }
    });
  }
});

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT);
}

//mongodb+srv://binayakway:hgYuUnzDAg7RgRwt@cluster0.s9rtniw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//hgYuUnzDAg7RgRwt
