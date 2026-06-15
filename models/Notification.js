import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  type: String,
  message: String,

  isRead: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}
);
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 172800 }
);
export default mongoose.model(
  "Notification",
  notificationSchema
);