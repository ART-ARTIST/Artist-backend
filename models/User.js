

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   name: { type: String, index: true },
    email: String,
    password: String,

    phone: String,
    bio: String,
    artistName: { type: String, index: true },
    artShopName: String,

    avatar: String,

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    followingArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🔥 ADD THESE FOR RECOMMENDATION ENGINE
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
  type: Number,
  default: 0,
},

    postsCount: {
      type: Number,
      default: 0,
    },

    totalLikes: {
      type: Number,
      default: 0,
    },

    recentActivityScore: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    accountType: {
      type: String,
      enum: ["seller", "showcase"],
      default: "showcase",
    },

    role: {
      type: String,
      enum: ["user", "artist", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);