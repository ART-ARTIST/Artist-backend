import express from "express";
import auth from "../middleware/auth.js";

import {
  globalSearch,
  searchUsers,
  searchPosts,
  
  searchShops,
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/", globalSearch);
router.get("/users", searchUsers);
router.get("/posts", searchPosts);

router.get(
  "/shops",
  searchShops
);
export default router;