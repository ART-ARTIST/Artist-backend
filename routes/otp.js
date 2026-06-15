import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otp.js";

dotenv.config();

const router = express.Router();

console.log("GMAIL_OTP EXISTS =", !!process.env.GMAIL_OTP);

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
  auth: {
    user: "artandartistneverstop@gmail.com",
    pass: process.env.GMAIL_OTP,
  },
});

// SMTP Check
transport.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail SMTP Verify Failed");
    console.error(error);
  } else {
    console.log("✅ Gmail SMTP Connected Successfully");
  }
});

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("================================");
    console.log("📧 OTP REQUEST START");
    console.log("📧 Email:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Email Required",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
    });

    console.log("🔐 OTP SAVED:", otp);

    const mailOption = {
      from: "artandartistneverstop@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `
      <h2>ArtZone OTP</h2>
      <h1>${otp}</h1>
      `,
    };

    console.log("📨 BEFORE SENDMAIL");

    const info = await transport.sendMail(mailOption);

    console.log("✅ AFTER SENDMAIL");
    console.log("MESSAGE ID:", info.messageId);
    console.log("RESPONSE:", info.response);

    return res.status(200).json({
      success: true,
      msg: "OTP Sent Successfully",
    });

  } catch (error) {

    console.error("❌ SENDMAIL ERROR START");
    console.error(error);
    console.error("MESSAGE:", error.message);
    console.error("CODE:", error.code);
    console.error("COMMAND:", error.command);
    console.error("❌ SENDMAIL ERROR END");

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

    const validOtp = await OTP.findOne({
      email,
      otp,
    });

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

    console.log(error);

    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});

export default router;






// import express from "express";
// import dotenv from "dotenv";
// import OTP from "../models/otp.js";
// import { Resend } from "resend";

// dotenv.config();

// const router = express.Router();

// // RESEND INIT
// const resend = new Resend(process.env.RESEND_API_KEY);

// // SEND OTP
// router.post("/send", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         msg: "Email Required",
//       });
//     }

//     // OTP GENERATE
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     // DB CLEAN + SAVE
//     await OTP.deleteMany({ email });
//     await OTP.create({ email, otp });

//     // SEND EMAIL (RESEND)
//     const { data, error } = await resend.emails.send({
//       from: "ArtistZone <onboarding@resend.dev>",
//       to: email,
//       subject: "OTP Verification",
//       html: `
//         <div style="text-align:center;font-family:Arial">
//           <h2>ArtZone OTP Verification</h2>
//           <h1 style="color:#8B5CF6;font-size:40px">${otp}</h1>
//           <p>This OTP is valid for 5 minutes</p>
//         </div>
//       `,
//     });

//     if (error) {
//       console.error("RESEND ERROR:", error);
//       return res.status(500).json({
//         success: false,
//         msg: "Failed to send OTP",
//       });
//     }

//     return res.json({
//       success: true,
//       msg: "OTP Sent Successfully",
//     });

//   } catch (error) {
//     console.error("OTP ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// });

// // VERIFY OTP (same)
// router.post("/verify", async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const validOtp = await OTP.findOne({ email, otp });

//     if (!validOtp) {
//       return res.status(400).json({
//         success: false,
//         msg: "Wrong OTP",
//       });
//     }

//     await OTP.deleteOne({ email });

//     return res.json({
//       success: true,
//       msg: "OTP Verified",
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       msg: "Server Error",
//     });
//   }
// });

// export default router;