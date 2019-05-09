const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./db/data");
const Users = require("./db/users");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://test:test123@ds131784.mlab.com:31784/alchemy";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getUsers", (req, res) => {

  let user = new Users();

  user.username = 'test';
  user.id = 0;
  user.password = 'test';
  user.discoveredElements = [];
  user.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.find({ username: username, password: password }, (err, result) => {
    if (err || !result.length) return res.status(401).json({ success: false, error: 'Something went wrong!' });
    if (result.length) {
      return res.json({ success: true, result: result });
    }
  });
});

router.get("/getStarters", (req, res) => {
  Data.find({ starter: true }, (err, result) => {
    return res.json({ success: true, result: result });
  });
});

router.post("/combineElements", (req, res) => {
  const { first, second } = req.body;
  console.log(req.body);
  Data.find({ parents: { $all: [first, second] } }, (err, result) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, result: result });
  });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));