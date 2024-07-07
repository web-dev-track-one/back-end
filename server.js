import express from "express";
import mongoose, { get } from "mongoose";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors()); // Use the cors package
app.use(express.json());

mongoose.connect(
  "mongodb+srv://ivanskraskov:4KqKUmH6xS7I7MQ9@trackone-version0.q4dbzi3.mongodb.net/TrackOne?retryWrites=true&w=majority&appName=TrackOne-version0"
);

const announcementSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
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

async function getAllAnnouncements() {
  try {
    // We use the find() method to find all the docs in the collection
    const announcements = await announcementModel.find({});
    return announcements;
  } catch (error) {
    console.error("Error retrieving announcements:", error);
    throw error; // Handle or propagate the error as needed
  }
}

// Due Dates Schema
const dueDateSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    Author: String,
    "Date Posted": Date,
    "Due Date": Date,
    Description: String,
    "Applicable to": String,
  },
  { strict: true }
);

const dueDateModel = mongoose.model("DueDates", dueDateSchema, "DueDates");

async function getAllDueDates() {
  try {
    const dueDates = await dueDateModel.find({});
    return dueDates;
  } catch (error) {
    console.error("Error retrieving due dates:", error);
    throw error;
  }
}

app.get("/announcements", async (req, res) => {
  let allAnnouncements = await getAllAnnouncements();
  console.log(allAnnouncements);
  res.send(allAnnouncements);
});

app.get("/duedates", async (req, res) => {
  // get the due dates from the database
  let allDueDates = await getAllDueDates();
  console.log(allDueDates);
  res.send(allDueDates);
});

app.post("/announcement", async (req, res) => {
  try {
    const newAnnouncement = new announcementModel({
      _id: new mongoose.Types.ObjectId(),
      Author: req.body.Author,
      Body: req.body.Body,
      Date: req.body.Date,
      Keywords: req.body.Keywords,
      "Disappear Date": req.body.DisappearDate,
    });

    await newAnnouncement.save();
    res.status(200).json({ message: "Announcement is created" });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(404).json({ message: "Error creating announcement" });
  }
});

app.post("/duedate", async (req, res) => {
  try {
    const newDueDate = new dueDateModel({
      _id: new mongoose.Types.ObjectId(),
      Author: req.body.Author,
      "Date Posted": req.body["Date Posted"],
      "Due Date": req.body["Due Date"],
      Description: req.body.Description,
      "Applicable to": req.body["Applicable to"],
    });
    await newDueDate.save();
    res.status(200).json({ message: "Due date is created" });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(404).json({ message: "Error creating announcement" });
  }
});

app.delete("/announcement/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await announcementModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Announcement is deleted" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(404).json({ message: "Error deleting announcement" });
  }
});

app.delete("/duedate/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await dueDateModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Due date is deleted" });
  } catch (error) {
    console.error("Error deleting due date:", error);
    res.status(404).json({ message: "Error deleting due date" });
  }
});

app.put("/announcement/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(typeof id);

    let updated_doc = await announcementModel.findByIdAndUpdate(
      id,
      {
        Author: req.body.Author,
        Body: req.body.Body,
        Date: req.body.Date,
        Keywords: req.body.Keywords,
        "Disappear Date": req.body.DisappearDate,
      },
      { returnDocument: "after" }
    );
    res.status(200).json({ message: "Announcement is updated" });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(404).json({ message: "Error updating announcement" });
  }
});

app.put("/duedate/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(typeof id);

    let updated_doc = await dueDateModel.findByIdAndUpdate(id, {
      Author: req.body.Author,
      "Date Posted": req.body["Date Posted"],
      "Due Date": req.body["Due Date"],
      Description: req.body.Description,
      "Applicable to": req.body["Applicable to"],
    });
    res.status(200).json({ message: "Due date is updated" });
  } catch (error) {
    console.error("Error updating due date:", error);
    res.status(404).json({ message: "Error updating due date" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
