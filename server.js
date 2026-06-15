// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.js";

// dotenv.config();

// const app = express();


// // ================= MIDDLEWARE =================
// app.use(cors());
// app.use(express.json());


// // ================= STATIC FOLDER =================
// app.use("/uploads", express.static("uploads"));


// // ================= ROUTES =================
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);


// // ================= DATABASE =================
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch((err) => console.log(err));


// // ================= SERVER =================
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT} 🚀`);
// });

// console.log("🔥 REAL SERVER RUNNING");
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import postRoutes from "./routes/postRoutes.js";
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.js";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/uploads", express.static("uploads"));

// // routes
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/posts", (req, res, next) => {
//   console.log("🔥 API POSTS HIT");
//   next();
// });
// app.get("/", (req, res) => {
//   res.send("Main Server Running");
// });


// // DB connect
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch((err) => console.log(err));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT} 🚀`);
// });

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

console.log("🔥 REAL SERVER RUNNING");

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import artistRoutes from "./routes/userRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import otpRoutes from "./routes/otp.js";
import commentRoutes from "./routes/commentRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import offerRoutes
from "./routes/offerRoutes.js";
import contactRequestRoutes
from "./routes/contactRequest.js";
import notificationRoutes
from "./routes/notificationRoutes.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// 🔥 DEBUG MIDDLEWARE (PUT BEFORE ROUTES)
app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});
// test route (IMPORTANT)
app.get("/ping", (req, res) => {
  res.send("Backend Working 🚀");
});


// routes

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", artistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/comments", commentRoutes);
app.use( "/api/banners",bannerRoutes);
app.use(
  "/api/offers",
  offerRoutes
);
app.use(
  "/api/contact-request",
  contactRequestRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
// app.get("/api/posts", (req, res) => {
//   console.log("🔥 SERVER LEVEL HIT");
//   res.json({ ok: true });
// });
app.use("/api/search", searchRoutes);

// DB connect
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} 🚀`);

});