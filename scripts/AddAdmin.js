// scripts/addAdmin.js
import mongoose from "mongoose";
import { User } from "../User.js";

mongoose.connect(
  "mongodb+srv://ivanskraskov:4KqKUmH6xS7I7MQ9@trackone-version0.q4dbzi3.mongodb.net/TrackOne?retryWrites=true&w=majority&appName=TrackOne-version0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const addAdmin = async () => {
  const username = "admin";
  const password = "adminPassword"; // change this to a strong password
  const user = new User({ username, password });
  await user.save();
  console.log("Admin user added");
  mongoose.disconnect();
};

addAdmin().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
