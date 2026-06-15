

import jwt from "jsonwebtoken";


const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    console.log("🔐 AUTH DEBUG:", {
      authHeader: authHeader ? "present" : "missing",
      token: token ? "present" : "missing",
      jwtSecret: process.env.JWT_SECRET ? "present" : "missing"
    });

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // ✅ id + role both available

    next();
  } catch (err) {
    console.log("🔐 AUTH ERROR:", err.message);
    return res.status(401).json({ msg: "Invalid token", error: err.message });
  }
};

export default auth;