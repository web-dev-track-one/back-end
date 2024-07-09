import express from "express";
import mongoose, { get } from "mongoose";
import cors from "cors";
import fs from "fs";

const app = express();
const port = 3000;

app.use(cors()); // Use the cors package
app.use(express.json());

mongoose.connect(
  "mongodb+srv://ivanskraskov:4KqKUmH6xS7I7MQ9@trackone-version0.q4dbzi3.mongodb.net/TrackOne?retryWrites=true&w=majority&appName=TrackOne-version0"
);

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

const Event = mongoose.model("Event", eventSchema, "Events");

// Helper function to read an image file and convert it to base64
function imageToBuffer(filePath) {
  const image = fs.readFileSync(filePath);
  return image;
}

// Create the event documents
const events = [
  {
    Title: "Event 1",
    Author: "Author 1",
    DatePosted: new Date(),
    DateOfEvent: new Date("2024-07-20"),
    ApplicableTo: "Everyone",
    Image: imageToBuffer("temp_pics/pic1.jpg"),
  },
  {
    Title: "Event 2",
    Author: "Author 2",
    DatePosted: new Date(),
    DateOfEvent: new Date("2024-08-15"),
    ApplicableTo: "Members",
    Image: imageToBuffer("temp_pics/pic2.jpg"),
  },
  {
    Title: "Event 3",
    Author: "Author 3",
    DatePosted: new Date(),
    DateOfEvent: new Date("2024-09-10"),
    ApplicableTo: "Guests",
    Image: imageToBuffer("temp_pics/pic3.jpg"),
  },
];

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

insertEvents();
