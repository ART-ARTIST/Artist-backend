import Notification from "../models/Notification.js";

export const getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        userId: req.params.userId,
      })
      .populate(
        "senderId",
        "name avatar"
      )
      .populate(
        "postId",
        "title media"
      )
      .sort({
        createdAt: -1,
      });

    res.json(notifications);

  } catch (err) {

    res.status(500).json({
      msg: err.message,
    });

  }

};

export const markAsRead =
async (req, res) => {

  try {

    await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      }
    );

    res.json({
      msg: "Notification marked as read",
    });

  } catch (err) {

    res.status(500).json({
      msg: err.message,
    });

  }

};


export const getUnreadCount =
async (req, res) => {

  try {

    const count =
      await Notification.countDocuments({
        userId: req.params.userId,
        isRead: false,
      });

    res.json({ count });

  } catch (err) {

    res.status(500).json({
      msg: err.message,
    });

  }

};

export const markAllRead =
async (req, res) => {

  await Notification.updateMany(
    {
      userId: req.params.userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );

  res.json({
    msg: "All notifications read",
  });

};