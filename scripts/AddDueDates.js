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

const dueDateSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    Author: String,
    "Date Posted": Date,
    "Due Date": Date,
    Description: String,
    "Applicable to": String,
    Title: String,
    Keywords: [String],
  },
  { strict: true }
);

dueDateSchema.index({ "Due Date": 1 });

const dueDateModel = mongoose.model("DueDates", dueDateSchema, "DueDates");

// Manually define 5 due dates
const dueDates = [
  {
    _id: new mongoose.Types.ObjectId(),
    Author: "Prof. John Doe",
    "Date Posted": new Date("2024-07-01T10:00:00Z"),
    "Due Date": new Date("2024-08-01T23:59:59Z"),
    Description: "Final project submission for Engineering Design course.",
    "Applicable to": "EngineeringPlus Students",
    Title: "Final Project Submission",
    Keywords: ["Final Project", "Submission", "Engineering Design"],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Author: "Dr. Jane Smith",
    "Date Posted": new Date("2024-07-05T12:00:00Z"),
    "Due Date": new Date("2024-07-25T23:59:59Z"),
    Description: "Midterm exam for Thermodynamics course.",
    "Applicable to": "TrackOne Students",
    Title: "Thermodynamics Midterm Exam",
    Keywords: ["Midterm", "Exam", "Thermodynamics"],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Author: "Prof. Alan Turing",
    "Date Posted": new Date("2024-06-30T09:00:00Z"),
    "Due Date": new Date("2024-07-20T23:59:59Z"),
    Description: "Research paper submission on Artificial Intelligence.",
    "Applicable to": "Graduate Students",
    Title: "AI Research Paper Submission",
    Keywords: ["Research Paper", "Submission", "Artificial Intelligence"],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Author: "Dr. Grace Hopper",
    "Date Posted": new Date("2024-07-03T11:00:00Z"),
    "Due Date": new Date("2024-07-18T23:59:59Z"),
    Description: "Homework assignment 3 for Computer Architecture course.",
    "Applicable to": "Computer Science Students",
    Title: "Computer Architecture Homework 3",
    Keywords: ["Homework", "Assignment", "Computer Architecture"],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Author: "Prof. Ada Lovelace",
    "Date Posted": new Date("2024-07-07T14:00:00Z"),
    "Due Date": new Date("2024-08-15T23:59:59Z"),
    Description: "End-of-term essay for Software Engineering course.",
    "Applicable to": "Software Engineering Students",
    Title: "Software Engineering End-of-term Essay",
    Keywords: ["Essay", "End-of-term", "Software Engineering"],
  },
];

// Insert the duedates
async function insertDueDates() {
  try {
    await dueDateModel.insertMany(dueDates);
    console.log("5 duedates inserted successfully");
  } catch (error) {
    console.error("Error inserting duedates:", error);
  } finally {
    mongoose.disconnect();
  }
}

insertDueDates();
