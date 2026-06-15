import express from "express";
import auth from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";
import upload from "../middleware/bannerUpload.js";

import {
  createBanner,
  getBanners,
   deleteBanner,
   toggleBanner,
   getAdminBanners,
} from "../controllers/bannerController.js";

const router = express.Router();

router.post(
  "/create",
    auth,
  adminOnly,
  upload.single("media"),
  createBanner
);

router.get(
  "/all",
  getBanners
);

export default router;
router.delete("/:id", auth, adminOnly, deleteBanner);
router.patch("/toggle/:id", auth, adminOnly, toggleBanner);
router.get("/admin", auth, adminOnly, getAdminBanners);