import express from "express";
import Auth from "./auth.js";

const router = express.Router();
router.get("/admin", Auth.auth, Auth.authorize("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

export default router;
