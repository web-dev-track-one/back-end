// scripts/addAdmin.js
import mongoose from "mongoose";
import { User } from "../User.js";

mongoose.connect(
  process.env.MONGO_URL,
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
