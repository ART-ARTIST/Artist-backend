import express from "express";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import axios from "axios";

dotenv.config();

const router = express.Router();

// SEND OTP using Brevo REST API to bypass Render SMTP blocks
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

    // SEND EMAIL (BREVO API)
    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "ArtistZone",
            email: process.env.BREVO_EMAIL || "artandartistneverstop@gmail.com",
          },
          to: [
            {
              email: email,
            },
          ],
          subject: "OTP Verification",
          htmlContent: `
            <div style="text-align:center;font-family:Arial">
              <h2>ArtZone OTP Verification</h2>
              <h1 style="color:#8B5CF6;font-size:40px">${otp}</h1>
              <p>This OTP is valid for 5 minutes</p>
            </div>
          `,
        },
        {
          headers: {
            "api-key": process.env.BREVO_SMTP_KEY,
            "Content-Type": "application/json",
            "accept": "application/json",
          },
        }
      );
    } catch (apiError) {
      console.error("BREVO API ERROR:", apiError.response?.data || apiError.message);
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP via Brevo",
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