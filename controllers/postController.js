
import Post from "../models/Post.js";
import User from "../models/User.js";








export const updatePost = async (req, res) => {
  try {
    console.log("ID =", req.params.id);
    console.log("BODY =", req.body);

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updated);

  } catch (error) {
    console.log("UPDATE ERROR =", error);
    res.status(500).json({
      message: error.message,
    });
  }
};





export const getTopProducts = async (req, res) => {
  try {

    const posts = await Post.find()

      .populate({
        path: "userId",
        select:
          "name artistName artShopName avatar followers",
      })

      .lean();

    const ranked = posts.map((post) => {

      const likes =
        post.likes?.length || 0;

      // FROM USER MODEL
      const followers =
        post.userId?.followers?.length || 0;

      const views =
        post.views || 0;

      const score =
        likes * 5 +
        followers * 3 +
        views;

      return {
        ...post,
        score,
      };
    });

    ranked.sort(
      (a, b) => b.score - a.score
    );

    res.json(ranked.slice(0, 100));

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};




// 🔥 INCREMENT VIEW
// 🔥 INCREMENT VIEW
export const incrementView = async (req, res) => {

  try {

    const { userId } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    // logged user OR guest IP
    const viewer = userId || req.ip;

    // unique view
    if (!post.viewedBy.includes(viewer)) {

      post.views += 1;

      post.viewedBy.push(viewer);

      await post.save();
    }

    res.json(post);

  } catch (error) {

    res.status(500).json({
      msg: error.message,
    });

  }
};




// save post
export const savePost = async (req, res) => {

  try {

    const { userId } = req.body;

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {

      return res.status(404).json({
        msg: "Post not found",
      });

    }

    // SAFE ARRAY
    if (!Array.isArray(post.savedBy)) {
      post.savedBy = [];
    }

    // CHECK ALREADY SAVED
    const alreadySaved =
      post.savedBy.includes(userId);

    if (alreadySaved) {

      // UNSAVE
      post.savedBy =
        post.savedBy.filter(
          (id) => id !== userId
        );

    } else {

      // SAVE
      post.savedBy.push(userId);

    }

    await post.save();

    res.status(200).json(post);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Server Error",
    });

  }
};


export const getSavedPosts = async (
  req,
  res
) => {
  try {
    const posts = await Post.find({
      savedBy: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// to get liked post
export const getLikedPosts =
  async (req, res) => {
    try {

      const posts =
        await Post.find({
          likes:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json(
        posts
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

//wishlist
export const wishlistPost = async (
  req,
  res
) => {
  try {

    const { userId } = req.body;

    const post =
      await Post.findById(
        req.params.id
      );

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    if (!Array.isArray(post.wishlistBy)) {
      post.wishlistBy = [];
    }

    const alreadyWishlisted =
      post.wishlistBy.includes(
        userId
      );

    if (alreadyWishlisted) {

      post.wishlistBy =
        post.wishlistBy.filter(
          (id) => id !== userId
        );

    } else {

      post.wishlistBy.push(
        userId
      );

    }

    await post.save();

    res.status(200).json(post);

  } catch (error) {

    res.status(500).json({
      msg: error.message,
    });

  }
};


export const getWishlistPosts =
async (req, res) => {

  try {

    const posts = await Post.find({
      wishlistBy: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      msg: error.message,
    });

  }

};