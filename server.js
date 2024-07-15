import express from "express";
import mongoose, { get } from "mongoose";
import cors from "cors";
import fs from "fs";
import cron from "node-cron";
import authenticate from "./auth.js";
import adminRoutes from "./admin.js";

const app = express();
const port = 3000;

app.use(cors()); // Use the cors package
app.use(express.json());

mongoose.connect(
  "mongodb+srv://ivanskraskov:4KqKUmH6xS7I7MQ9@trackone-version0.q4dbzi3.mongodb.net/TrackOne?retryWrites=true&w=majority&appName=TrackOne-version0"
);
const teamMemberSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: String,
  Role: String,
  Bio: String,
  Image: String, // will contain a url to a picture
});

const teamMemberModel = mongoose.model("TeamMembers", teamMemberSchema);

async function getAllTeamMembers() {
  try {
    const teamMembers = await teamMemberModel.find({});
    return teamMembers;
  } catch (error) {
    console.error("Error retrieving team members:", error);
    throw error;
  }
}

const eventSchema = new mongoose.Schema(
  {
    Title: String,
    Author: String,
    Body: String,
    DatePosted: Date,
    DateOfEvent: Date,
    ApplicableTo: String,
    Image: Buffer,
  },
  { strict: true }
);

const eventModel = mongoose.model("Event", eventSchema, "Events");

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
    Title: String,
    Keywords: [String],
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

async function getAllEvents() {
  try {
    const events = await eventModel.find({});
    return events;
  } catch (error) {
    console.error("Error retrieving events:", error);
    throw error;
  }
}

app.get("/team", async (req, res) => {
  const allTeamMembers = await getAllTeamMembers();
  res.send(allTeamMembers);
});

app.get("/announcements", async (req, res) => {
  let allAnnouncements = await getAllAnnouncements();
  console.log(allAnnouncements[0]);
  res.send(allAnnouncements);
});

app.get("/events", async (req, res) => {
  let allEvents = await getAllEvents();

  // Convert the image to base64
  const eventsWithBase64Image = allEvents.map((event) => ({
    ...event.toJSON(),
    Image: event.Image.toString("base64"),
  }));
  res.json(eventsWithBase64Image);
});

app.get("/duedates", async (req, res) => {
  // get the due dates from the database
  let allDueDates = await getAllDueDates();
  console.log(allDueDates);
  res.send(allDueDates);
});

app.post("/team", async (req, res) => {
  try {
    const newTeamMember = new teamMemberModel({
      _id: new mongoose.Types.ObjectId(),
      Name: req.body.Name,
      Role: req.body.Role,
      Bio: req.body.Bio,
      Image: req.body.Image,
    });

    await newTeamMember.save();
    res.status(200).json({ message: "Team member is created" });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(404).json({ message: "Error creating team member" });
  }
});

app.post("/announcement", async (req, res) => {
  try {
    const newAnnouncement = new announcementModel({
      _id: new mongoose.Types.ObjectId(),
      Title: req.body.Title,
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

app.post("/event", async (req, res) => {
  try {
    const newEvent = new eventModel({
      _id: new mongoose.Types.ObjectId(),
      Title: req.body.Title,
      Author: req.body.Author,
      Body: req.body.Body,
      DateOfEvent: req.body.DateOfEvent,
      DatePosted: req.body.DatePosted,
      ApplicableTo: req.body.ApplicableTo,
      Image: req.body.Image,
    });

    await newEvent.save();
    res.status(200).json({ message: "Event is created" });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(404).json({ message: "Error creating event" });
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
      Title: req.body.Title,
      Keywords: req.body.Keywords,
    });
    await newDueDate.save();
    res.status(200).json({ message: "Due date is created" });
  } catch (error) {
    console.error("Error creating the due date:", error);
    res.status(404).json({ message: "Error creating a due date" });
  }
});

app.delete("/team/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await teamMemberModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Team member is deleted" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(404).json({ message: "Error deleting team member" });
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

app.delete("/event/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await eventModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Event is deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(404).json({ message: "Error deleting event" });
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

app.put("/team/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let updated_doc = await teamMemberModel.findByIdAndUpdate(
      id,
      {
        Name: req.body.Name,
        Role: req.body.Role,
        Bio: req.body.Bio,
        Image: req.body.Image,
      },
      { returnDocument: "after" }
    );
    res.status(200).json({ message: "Team member is updated" });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(404).json({ message: "Error updating team member" });
  }
});

app.put("/announcement/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let updated_doc = await announcementModel.findByIdAndUpdate(
      id,
      {
        Author: req.body.Author,
        Title: req.body.Title,
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

app.put("/event/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(typeof id);

    let updated_doc = await eventModel.findByIdAndUpdate(
      id,
      {
        Author: req.body.Author,
        Title: req.body.Title,
        Body: req.body.Body,
        DatePosted: req.body.DatePosted,
        DateOfEvent: req.body.DateOfEvent,
        ApplicableTo: req.body.ApplicableTo,
        Image: req.body.Image,
      },
      { returnDocument: "after" }
    );
    res.status(200).json({ message: "Event is updated" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(404).json({ message: "Error updating event" });
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
      Title: req.body.Title,
      Keywords: req.body.Keywords,
    });
    res.status(200).json({ message: "Due date is updated" });
  } catch (error) {
    console.error("Error updating due date:", error);
    res.status(404).json({ message: "Error updating due date" });
  }
});

async function duedatesDateBasedDeletion(currentDateMinusMonth) {
  let allDueDates = await getAllDueDates();
  allDueDates.forEach(async (dueDate) => {
    if (dueDate["Due Date"] < currentDateMinusMonth) {
      await dueDateModel.findByIdAndDelete(dueDate._id);
    }
  });
}

async function eventsdateBasedDeletion(currentDateMinusMonth) {
  let allEvents = await getAllEvents();
  allEvents.forEach(async (event) => {
    if (event.DateOfEvent < currentDateMinusMonth) {
      await eventModel.findByIdAndDelete(event._id);
    }
  });
}

async function announcementsDateBasedDeletion(currentDateMinusMonth) {
  let allAnnouncements = await getAllAnnouncements();
  allAnnouncements.forEach(async (announcement) => {
    if (announcement["Disappear Date"] < currentDateMinusMonth) {
      console.log("Deleting announcement");
      await announcementModel.findByIdAndDelete(announcement._id);
    }
  });
}

// Delets documents a month after their respective "expire" date
function deleteExpiredDocs() {
  let currentDate = new Date();
  let currentDateMinusMonth = currentDate.setMonth(currentDate.getMonth() - 1);

  announcementsDateBasedDeletion(currentDateMinusMonth);
  eventsdateBasedDeletion(currentDateMinusMonth);
  duedatesDateBasedDeletion(currentDateMinusMonth);
}

//Schedule the deletion of expired announcements every Sunday Nigth
cron.schedule("0 0 * * 1", () => {
  console.log(
    "Running a task every Monday at 00:00 AM to delete expired documents"
  );
  deleteExpiredDocs();
  console.log("Expired documents deleted");
});

// Use the auth routes
app.use("/auth", authenticate.router);

// Use the admin routes
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
