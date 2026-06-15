import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    media: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    active: {
      type: Boolean,
      default: true,
    },
    position: {
  type: String,
  enum: ["hero", "top", "middle", "bottom"],
  default: "hero"
},
  },
  
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Banner",
  bannerSchema
);