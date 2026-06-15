import express from "express";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import { Resend } from "resend";

dotenv.config();

const router = express.Router();

// RESEND INIT
const resend = new Resend(process.env.RESEND_API_KEY);

// SEND OTP
router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Email Required",
      });
    }

    // OTP GENERATE
    const otp = Math.floor(1000 + Math.random() * 9000);

    // DB CLEAN + SAVE
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    // SEND EMAIL (RESEND)
    const { data, error } = await resend.emails.send({
      from: "ArtistZone <onboarding@resend.dev>",
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="text-align:center;font-family:Arial">
          <h2>ArtZone OTP Verification</h2>
          <h1 style="color:#8B5CF6;font-size:40px">${otp}</h1>
          <p>This OTP is valid for 5 minutes</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP via Resend",
      });
    }

    return res.json({
      success: true,
      msg: "OTP Sent Successfully",
    });

  } catch (error) {
    console.error("OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
});

// VERIFY OTP
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

    return res.json({
      success: true,
      msg: "OTP Verified",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});

export default router;