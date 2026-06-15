import mongoose from "mongoose";

const contactRequestSchema =
  new mongoose.Schema(
    {
      artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
          "cancelled",
        ],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "ContactRequest",
  contactRequestSchema
);