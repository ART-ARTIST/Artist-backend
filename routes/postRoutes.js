



import express from "express";

import Post from "../models/Post.js";
import User from "../models/User.js";

import { postUpload } from "../middleware/postUpload.js";
import Notification from "../models/Notification.js";

import {
  updatePost,
  incrementView,
  getTopProducts,
  savePost,
  getSavedPosts,
   getLikedPosts,
    wishlistPost,
  getWishlistPosts,
   
   
} from "../controllers/postController.js";

import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* =========================
   CREATE POST
========================= */
router.post(
  "/create",
  postUpload.array("media", 10),
  async (req, res) => {
    try {

      const mediaFiles =
        req.files?.map((file) => ({
          url: file.path,
          type: file.mimetype.startsWith("video")
            ? "video"
            : "image",
        })) || [];

      const post = await Post.create({
        userId: req.body.userId,
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        forSale: req.body.forSale,
        media: mediaFiles,
        likes: [],
        savedBy: [],
        comments: [],
      });

      res.status(201).json(post);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Upload failed",
      });

    }
  }
);

/* =========================
   GET ALL POSTS
========================= */
// router.get("/all", async (req, res) => {

//   try {

//     const { category } = req.query;

//     const filter =
//       category && category !== "all"
//         ? {
//             category: {
//               $regex: new RegExp(`^${category}$`, "i"),
//             },
//           }
//         : {};

//     const posts = await Post.find(filter)
//       .sort({ createdAt: -1 })
//       .populate(
//         "userId",
//         "name artistName avatar followers"
//       );

//     res.json({
//       posts,
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: "Server Error",
//     });

//   }
// });


router.get("/all", async (req, res) => {
  try {

    const { category } = req.query;

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 20;

    const skip =
      (page - 1) * limit;

    const filter =
      category && category !== "all"
        ? {
            category: {
              $regex: new RegExp(
                `^${category}$`,
                "i"
              ),
            },
          }
        : {};

    const totalPosts =
      await Post.countDocuments(
        filter
      );

    const posts = await Post.find(
      filter
    )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .populate(
        "userId",
        "name artistName avatar followers"
      );

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(
        totalPosts / limit
      ),
      totalPosts,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

/* =========================
   TOP PRODUCTS
========================= */
router.get(
  "/top-products",
  getTopProducts
);

/* =========================
   USER POSTS
========================= */
router.get(
  "/user/:id",
  async (req, res) => {

    try {

      const posts = await Post.find({
        userId: req.params.id,
      })
        .sort({ createdAt: -1 })
        .populate(
          "userId",
          "name artistName avatar followers"
        );

      res.json(posts);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Failed to fetch user posts",
      });

    }
  }
);

/* =========================
   PROFILE
========================= */
router.get(
  "/profile/:id",
  async (req, res) => {

    try {

      const user = await User.findById(
        req.params.id
      ).select("name phone");

      res.json(user);

    } catch (err) {

      res.status(500).json({
        msg: "Server Error",
      });

    }
  }
);

/* =========================
   LIKE POST
========================= */
// router.put(
//   "/like/:id",
//   async (req, res) => {

//     try {

//       const post = await Post.findById(
//         req.params.id
//       );

//       const userId = req.body.userId;

//       if (!post.likes.includes(userId)) {

//         post.likes.push(userId);

//       } else {

//         post.likes = post.likes.filter(
//           (id) => id !== userId
//         );
//       }

//       await post.save();

//       res.json(post);

//     } catch (err) {

//       res.status(500).json({
//         message: "Like failed",
//       });

//     }
//   }
// );



router.put(
  "/like/:id",
  async (req, res) => {

    try {

      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      const userId =
        req.body.userId;

      const isLiked =
        post.likes.includes(
          userId
        );

      if (!isLiked) {

        post.likes.push(
          userId
        );

        // Notification only on LIKE
        if (
          post.userId.toString() !==
          userId
        ) {

          const user =
            await User.findById(
              userId
            );

          await Notification.create({
            userId:
              post.userId,
            senderId:
              userId,
            postId:
              post._id,
            type: "like",
            message: `${user.name} liked your artwork`,
          });

        }

      } else {

        post.likes =
          post.likes.filter(
            id =>
              id.toString() !==
              userId
          );

      }

      await post.save();

      res.json(post);

    } catch (err) {

      console.log(
        "LIKE ERROR:",
        err
      );

      res.status(500).json({
        message: "Like failed",
      });

    }

  }
);



/* =========================
   SAVE POST
========================= */
router.put(
  "/save/:id",
  async (req, res) => {

    try {

      const post = await Post.findById(
        req.params.id
      );

      const userId = req.body.userId;

      if (!post.savedBy?.includes(userId)) {

        post.savedBy.push(userId);

      } else {

        post.savedBy =
          post.savedBy.filter(
            (id) => id !== userId
          );
      }

      await post.save();

      res.json(post);

    } catch (err) {

      res.status(500).json({
        message: "Save failed",
      });

    }
  }
);

/* =========================
   VIEW COUNT
========================= */
router.put(
  "/view/:id",
  incrementView
);

/* =========================
   UPDATE POST
========================= */
router.put(
  "/:id",
  updatePost
);

/* =========================
   DELETE POST
========================= */
router.delete(
  "/:id",
  async (req, res) => {

    try {

      const post = await Post.findById(
        req.params.id
      );

      if (!post) {

        return res.status(404).json({
          message: "Post not found",
        });
      }

      for (const file of post.media) {

        const url = file.url;

        const parts = url.split("/");

        const fileName =
          parts[parts.length - 1];

        const publicId =
          "posts/" +
          fileName.split(".")[0];

        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type:
              file.type === "video"
                ? "video"
                : "image",
          }
        );
      }

      await Post.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Post deleted successfully ✅",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Delete failed",
      });

    }
  }
);

/* =========================
   SINGLE POST
========================= */
/* YE HAMESHA LAST MAI HONA CHAHIYE */
router.get(
  "/:id",
  async (req, res) => {

    try {

      const post = await Post.findById(
        req.params.id
      ).populate("userId");

      if (!post) {

        return res.status(404).json({
          message: "Post not found",
        });
      }

      res.json(post);

    } catch (err) {

      res.status(500).json({
        message: "Error fetching post",
      });

    }
  }


  
);



//to save
router.put(
  "/save/:id",
  savePost
);
// saved post
router.get(
  "/saved/:userId",
  getSavedPosts
);
// to get like post
router.get(
  "/liked/:userId",
  getLikedPosts
);

// wishlist
router.put(
  "/wishlist/:id",
  wishlistPost
);

router.get(
  "/wishlist/:userId",
  getWishlistPosts
);


export default router;



