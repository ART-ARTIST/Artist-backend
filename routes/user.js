
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// GET PROFILE
router.get("/profile/:id", getUserProfile);


// UPDATE PROFILE (with avatar upload)
router.put("/profile/:id", upload.single("avatar"), updateUserProfile);
// change password
router.put(
  "/change-password/:userId",
  changePassword
);


export default router;