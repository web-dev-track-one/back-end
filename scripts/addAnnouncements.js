import express from "express";
import mongoose, { get } from "mongoose";
import cors from "cors";
import fs from "fs";

const app = express();
const port = 3000;

app.use(cors()); // Use the cors package
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

const announcementSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    Title: String,
    Author: String,
    Body: String,
    Date: Date,
    Keywords: [String],
    "Disappear Date": Date,
  },
  { strict: true }
);

const announcementModel = mongoose.model(
  "Announcements",
  announcementSchema,
  "Announcements"
);

// Manually define 5 announcements
const announcements = [
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Another One",
    Author: "Author 1",
    Body: "This is the body of announcement 1",
    Date: new Date("2024-11-01"),
    Keywords: ["event", "update"],
    "Disappear Date": new Date("2023-09-15"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "And one More",
    Author: "Author 2",
    Body: "This is the body of announcement 2",
    Date: new Date("2023-07-01"),
    Keywords: ["meeting", "info"],
    "Disappear Date": new Date("2023-11-01"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Viking Ship",
    Author: "Author 3",
    Body: "This is the body of announcement 3",
    Date: new Date("2024-01-01"),
    Keywords: ["news", "event"],
    "Disappear Date": new Date("2024-12-01"), // not expired
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Piranha",
    Author: "Author 4",
    Body: "This is the body of announcement 4",
    Date: new Date("2023-01-01"),
    Keywords: ["update", "alert"],
    "Disappear Date": new Date("2023-11-01"), // expired
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Jack Sparrow",
    Author: "Author 5",
    Body: "This is the body of announcement 5",
    Date: new Date("2023-12-01"),
    Keywords: ["reminder", "deadline"],
    "Disappear Date": new Date("2024-09-01"), // not expired
  },
];

// Insert the announcements into the database
async function insertAnnouncements() {
  try {
    await announcementModel.insertMany(announcements);
    console.log("5 announcements inserted successfully");
  } catch (error) {
    console.error("Error inserting announcements:", error);
  } finally {
    mongoose.disconnect();
  }
}

insertAnnouncements();
