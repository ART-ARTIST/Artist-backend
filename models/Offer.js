import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    offerPrice: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined","cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Offer",
  offerSchema
);