const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package

const app = express();
const port = 3000;

app.use(cors()); // Use the cors package
app.use(express.json());

app.get("/announcements", (req, res) => {
  // get the announcements from the database
  // res.send(announcements);
});

app.get("/duedates", (req, res) => {
  // get the due dates from the database
  // res.send(dues dates);
});
