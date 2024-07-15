import express from "express";
import jwt from "jsonwebtoken";
import User from "./User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user);
  console.log(req.body);
  console.log(username);
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // NOTE, the secret key should be stored in an environment variable!!! Fix later.
  const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
    expiresIn: "2h",
  }); // payload
  // The payload contains information about the user that you want to include in the token.
  // This data is encoded (not encrypted) in the token and can be decoded by anyone who has the token.
  // Therefore, sensitive information should not be stored here.

  res.status(200).json({ token });
});

const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = () => (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export default { router, auth, authorize };
