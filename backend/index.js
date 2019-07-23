const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./db/data");
const Users = require("./db/users");
const Suggestions = require("./db/suggestions");

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

router.post("/register", (req, res) => {
  let user = new Users();

  const { username, password, discoveredElements } = req.body;
  user.username = username;
  user.password = password;
  user.discoveredElements = discoveredElements;
  Users.find({ username: username }, (err, result) => {
    if (result.length) {
      return res.json({ success: false, error: 'User already exists!' });
    }

    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, result: user });
    });
  });

});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.find({ username: username, password: password }, (err, result) => {
    if (err || !result.length) return res.json({ success: false, error: 'Incorrect credentials!' });
    if (result.length) {
      return res.json({ success: true, result: result });
    }
  });
});

router.put('/update', (req, res) => {
  const { username, discoveredElements } = req.body;
  Users.updateOne({ username: username }, { $set: { discoveredElements } }, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getStarters", (req, res) => {
  Data.find({ starter: true }, (err, result) => {
    return res.json({ success: true, result: result });
  });
});

router.post("/combineElements", (req, res) => {
  const { first, second } = req.body;
  Data.find({
    $or: [
      {
        parents: {
          $eq: [
            first,
            second
          ]
        }
      },
      {
        parents: {
          $eq: [
            second,
            first
          ]
        }
      }
    ]
  }, (err, result) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, result: result });
  });
});

router.post("/getSuggestions", (req, res) => {
  const { elements } = req.body;
  Data.find({
    $expr: {
      $setIsSubset: [
        "$parents",
        elements
      ]
   }
  }, {_id: 0}, (err, result) => {
    const resultIds = result.map(element => element.id);
    Suggestions.find({ element: { $in: resultIds } }, (err, suggestions) => {
      return res.json({ success: true, result: suggestions });
    });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));