import express from "express";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Email Required",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    const htmlContent = `
        <div style="text-align:center;font-family:Arial">
          <h2>ArtZone OTP Verification</h2>
          <h1 style="color:#8B5CF6;font-size:40px">${otp}</h1>
          <p>This OTP is valid for 5 minutes</p>
        </div>
      `;

    // Hit the Vercel Microservice
    await axios.post(
      process.env.VERCEL_EMAIL_SERVICE_URL || "http://localhost:3000/api/send",
      {
        to: email,
        subject: "OTP Verification",
        html: htmlContent,
      }
    );

    return res.status(200).json({
      success: true,
      msg: "OTP Sent Successfully",
    });

  } catch (error) {
    console.error("PROXY EMAIL ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to send OTP via Proxy",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await OTP.findOne({ email, otp });

    if (!validOtp) {
      return res.status(400).json({
        success: false,
        msg: "Wrong OTP",
      });
    }

    await OTP.deleteOne({ email });

    res.json({
      success: true,
      msg: "OTP Verified",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});

export default router;