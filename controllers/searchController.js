import User from "../models/User.js";
import Post from "../models/Post.js";

// export const globalSearch = async (req, res) => {
//   try {
//     const q = req.query.q?.trim();
    

//     if (!q) {
//       return res.json({
//         users: [],
//         posts: []
//       });
//     }

//     const users = await User.find({
//       $or: [
//         { name: { $regex: q, $options: "i" } },
//         { artistName: { $regex: q, $options: "i" } }
//       ]
//     })
//     .select("name avatar artistName")
//     .limit(8);

//     const posts = await Post.find({
//       $or: [
//         { title: { $regex: q, $options: "i" } },
//         { category: { $regex: q, $options: "i" } },
//         { description: { $regex: q, $options: "i" } }
//       ]
//     })
//     .populate("user", "name avatar artistName")
//     .limit(12);

//     res.json({
//       users,
//       posts
//     });

//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };


export const globalSearch = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    console.log("Search Query:", q);

    if (!q) {
      return res.json({ users: [], posts: [] });
    }
const users = await User.find({
  $or: [
    { name: { $regex: q, $options: "i" } },
    { artistName: { $regex: q, $options: "i" } },
    { artShopName: { $regex: q, $options: "i" } }
  ]
})
.select("name avatar artistName")
.limit(10);

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    });

    console.log("Users:", users.length);
    console.log("Posts:", posts.length);

    res.json({ users, posts });

  } catch (error) {
    console.log("SEARCH ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    const users = await User.find({
  $or: [
    { name: { $regex: q, $options: "i" } },
    { artistName: { $regex: q, $options: "i" } },
    { artShopName: { $regex: q, $options: "i" } }
  ]
})
.select("name avatar artistName")
.limit(10);

    res.json(users);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    })
    .populate("userId", "name avatar artistName")
    .limit(20);

    res.json(posts);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const searchShops = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";

    const shops = await User.find({
      artShopName: {
        $regex: q,
        $options: "i",
      },
    })
      .select(
        "name artistName artShopName avatar followers"
      )
      .limit(20);

    res.json(shops);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};