import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: String,
  Role: String,
  Bio: String,
  Image: String, // will contain a url to a picture
});

const teamMemberModel = mongoose.model("TeamMembers", teamMemberSchema);

const teamMembers = [
  {
    _id: new mongoose.Types.ObjectId(),
    Name: "John Doe",
    Role: "Lead Developer",
    Bio: "John is an experienced developer specializing in full-stack development.",
    Image: "https://example.com/images/john.jpg",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    Name: "Jane Smith",
    Role: "Project Manager",
    Bio: "Jane is a skilled project manager with a background in software development.",
    Image: "https://example.com/images/jane.jpg",
  },
  // Add more team members as needed
];

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    return teamMemberModel.insertMany(teamMembers);
  })
  .then((docs) => {
    console.log("Team members added:", docs);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB or inserting documents:", error);
  })
  .finally(() => {
    mongoose.connection.close();
  });
