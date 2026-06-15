import express from "express";

import Comment from "../models/Comment.js";

const router = express.Router();






router.get(
  "/history/:userId",
  async (req, res) => {
    try {

      const comments =
        await Comment.find({
          userId:
            req.params.userId,
        })

          .populate(
            "postId",
            "title media"
          )

          .sort({
            createdAt: -1,
          });

      res.json(comments);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
      });

    }
  }
);

/* =========================
   GET COMMENTS
========================= */

router.get("/:postId", async (req, res) => {

  try {

    const comments = await Comment.find({
      postId: req.params.postId,
    })

      .populate(
        "userId",
        "name artistName avatar"
      )

      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});

/* =========================
   ADD COMMENT
========================= */

router.post("/:postId", async (req, res) => {

  try {

    const { userId, text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        msg: "Comment required",
      });
    }

    const comment = await Comment.create({
      postId: req.params.postId,
      userId,
      text,
    });

    const populatedComment =
      await Comment.findById(comment._id)

        .populate(
          "userId",
          "name artistName avatar"
        );

    res.json(populatedComment);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});



router.delete("/:id", async (req, res) => {

  try {

    await Comment.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});







export default router;