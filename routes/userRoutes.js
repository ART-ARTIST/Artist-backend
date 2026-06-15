import express from "express";
import auth from "../middleware/auth.js";

import {
  followUser,
  unfollowUser,
  // getSuggestedArtists,
  getTrendingArtists,
  getArtistProfile,
  getFollowingArtists,
} from "../controllers/userController.js";

const router = express.Router();

// 🔒 Protected Routes

// to follow back
router.put("/follow/:userId", auth, followUser);

router.put("/unfollow/:userId", auth, unfollowUser);
// router.get("/suggested-users", auth, getSuggestedArtists);

//artist you follow
router.get("/following-users", auth, getFollowingArtists);
// 🌍 Public Routes
router.get("/trending-users", getTrendingArtists);
router.get("/artist/:id", getArtistProfile);

export default router;