import express from "express";

import {
  getNotifications,
  markAsRead,
  getUnreadCount,
  markAllRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/:userId",
  getNotifications
);

router.put(
  "/read/:id",
  markAsRead
);


router.get(
  "/unread/:userId",
  getUnreadCount
);


router.put(
  "/read-all/:userId",
  markAllRead
);
export default router;