




import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


// GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
      .populate("followers", "name avatar artistName")
  .populate("followingArtists", "name avatar artistName");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, bio, artistName, artShopName } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (artistName) user.artistName = artistName;
    if (artShopName) user.artShopName = artShopName;

    // if (req.file?.filename) {
    //   user.avatar = `/uploads/${req.file.filename}`;
    // }
      if (req.file) {
  user.avatar = req.file.path;
}
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};








/* ================= FOLLOW USER ================= */
export const followUser = async (req, res) => {
  try {
    const userId = req.user.id;           // logged-in user
    const targetId = req.params.userId;   // user to follow

    if (userId === targetId) {
      return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    // add follow (NO duplicates)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followingArtists: targetId },
    });

    await User.findByIdAndUpdate(targetId, {
      $addToSet: { followers: userId },
    });

    

    res.json({ success: true, msg: "Followed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Follow failed" });
  }
};

/* ================= UNFOLLOW USER ================= */
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.userId;

    await User.findByIdAndUpdate(userId, {
      $pull: { followingArtists: targetId },
    });

    await User.findByIdAndUpdate(targetId, {
      $pull: { followers: userId },
    });

    res.json({ success: true, msg: "Unfollowed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unfollow failed" });
  }
};


// TRENDING
export const getTrendingArtists = async (req, res) => {
  try {
   const users = await User.find({
  role: { $in: ["user", "admin"] }
});

    const ranked = users.map(u => {
      const followers = u.followers?.length || 0;
      const posts = u.postsCount || 0;
      const likes = u.totalLikes || 0;

      // 🔥 IMPORTANT BOOST (cold start fix)
      const score =
        followers * 5 +
        posts * 3 +
        likes * 2 +
        (followers === 0 ? 2 : 0);

      return { user: u, score };
    });

    ranked.sort((a, b) => b.score - a.score);

    res.json(ranked.slice(0, 10).map(r => r.user));

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ARTIST PROFILE
export const getArtistProfile = async (req, res) => {
  try {
    const artist = await User.findById(req.params.id).populate(
  "followers",
  "name artistName avatar"
)
.populate(
  "followingArtists",
  "name artistName avatar "
);

    const posts = await Post.find({
      userId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json({ artist, posts });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//following artist
export const getFollowingArtists = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("followingArtists");

    res.json(user.followingArtists);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// change password
// export const changePassword = async (
//   req,
//   res
// ) => {
//   try {

//     const {
//       currentPassword,
//       newPassword,
//     } = req.body;

//     const user =
//       await User.findById(
//         req.params.userId
//       );

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const isMatch =
//       await bcrypt.compare(
//         currentPassword,
//         user.password
//       );

//     if (!isMatch) {
//       return res.status(400).json({
//         message:
//           "Current password is incorrect",
//       });
//     }

//     const hashedPassword =
//       await bcrypt.hash(
//         newPassword,
//         10
//       );

//     user.password =
//       hashedPassword;

//     await user.save();
    

//     await transport.sendMail({
//       from:
//         "artandartistneverstop@gmail.com",
//       to: user.email,
//       subject:
//         "Password Changed Successfully",
//       html: `
//         <h2>Password Changed</h2>
//         <p>Your password has been changed successfully.</p>
//       `,
//     });

//     res.status(200).json({
//       message:
//         "Password updated successfully",
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       message: error.message,
//     });

//   }
// };

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    await resend.emails.send({
      from: "ArtistZone <onboarding@resend.dev>",
      to: user.email,
      subject: "Password Changed Successfully",
      html: `
        <h2>Password Changed</h2>
        <p>Your password has been changed successfully.</p>
      `,
    });

    res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};