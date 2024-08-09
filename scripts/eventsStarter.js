import express from "express";
import mongoose, { get } from "mongoose";
import cors from "cors";
import fs from "fs";

const app = express();
const port = process.env.PORT;

app.use(cors()); // Use the cors package
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

// Define the event schema
const eventSchema = new mongoose.Schema(
  {
    Title: String,
    Author: String,
    DatePosted: Date,
    DateOfEvent: Date,
    ApplicableTo: String,
    Image: Buffer,
  },
  { strict: true }
);
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
    Title: "Announcement 1",
    Author: "Author 1",
    Body: "This is the body of announcement 1",
    Date: new Date("2023-06-01"),
    Keywords: ["event", "update"],
    "Disappear Date": new Date("2023-06-15"), // expired
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Announcement 2",
    Author: "Author 2",
    Body: "This is the body of announcement 2",
    Date: new Date("2023-07-01"),
    Keywords: ["meeting", "info"],
    "Disappear Date": new Date("2023-08-01"), // not expired
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Announcement 3",
    Author: "Author 3",
    Body: "This is the body of announcement 3",
    Date: new Date("2024-01-01"),
    Keywords: ["news", "event"],
    "Disappear Date": new Date("2024-02-01"), // not expired
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Announcement 4",
    Author: "Author 4",
    Body: "This is the body of announcement 4",
    Date: new Date("2023-01-01"),
    Keywords: ["update", "alert"],
    "Disappear Date": new Date("2023-02-01"), // expired
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Title: "Announcement 5",
    Author: "Author 5",
    Body: "This is the body of announcement 5",
    Date: new Date("2023-12-01"),
    Keywords: ["reminder", "deadline"],
    "Disappear Date": new Date("2024-01-01"), // not expired
  },
];

const Event = mongoose.model("Event", eventSchema, "Events");

// Create the event documents
const events = [
  {
    Title: "Event 1",
    Author: "Author 1",
    DatePosted: new Date(),
    DateOfEvent: new Date("2024-07-20"),
    ApplicableTo: "Everyone",
    Image: imageToBuffer("temp_pics/pic4.jpg"),
  },
];
function imageToBuffer(imagePath) {
  return fs.readFileSync(imagePath);
}

// Insert the events into the database
async function insertEvents() {
  try {
    await Event.insertMany(events);
    console.log("Events inserted successfully!");
  } catch (error) {
    console.error("Error inserting events:", error);
  } finally {
    mongoose.connection.close();
  }
}
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
