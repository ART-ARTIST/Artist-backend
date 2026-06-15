import mongoose from "mongoose";

const getMongoUri = () => {
  if (process.env.USE_LOCAL_DB === "true") {
    return process.env.MONGO_URI_LOCAL || process.env.MONGO_URI;
  }
  return process.env.MONGO_URI;
};

export const connectDB = async () => {
  const uri = getMongoUri();

  if (!uri) {
    console.log("DB Error ❌: No MongoDB URI configured.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.log("DB Error ❌", err);
  }
};