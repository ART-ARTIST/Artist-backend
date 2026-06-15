import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      index: true,
      required: true,
    },

    price: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    forSale: {
      type: Boolean,
      default: true,
    },

    // ✅ IMAGE + VIDEO SUPPORT
    media: [
      {
        url: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],

    likes: {
      type: [String],
      default: [],
    },
    

  views: {
  type: Number,
  default: 0,
},

viewedBy: [
  {
    type: String,
  },
],




savedBy: {
  type: [String],
  default: [],
},

wishlistBy: {
  type: [String],
  default: [],
},

    comments: [
      {
        userId: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },


  
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);