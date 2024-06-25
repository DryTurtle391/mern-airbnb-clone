const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "vavvIUIUib98YBUJUBUBbbo";

dotenv.config();

app.use(express.json());
app.use(cookieParser());
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

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT);
}

//mongodb+srv://binayakway:hgYuUnzDAg7RgRwt@cluster0.s9rtniw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//hgYuUnzDAg7RgRwt
