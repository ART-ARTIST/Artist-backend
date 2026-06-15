
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
    });

    res.json({
      msg: "Registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    

    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // 🔥 TOKEN
    const token = jwt.sign(
      { id: user._id ,   role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/reset-password", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        msg: "User Not Found",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      msg: "Password Updated",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});



router.delete("/delete-user/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {

      return res.status(404).json({
        success: false,
        msg: "User Not Found",
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      msg: "User Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});

export default router;