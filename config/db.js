import mongoose from "mongoose";

const getMongoUri = () => {
  // Hardcoded fallback for Render in case Env vars are not set correctly
  const atlasUri = "mongodb://dalipchand602:Dishu162003@user-shard-00-00.c4vl7.mongodb.net:27017,user-shard-00-01.c4vl7.mongodb.net:27017,user-shard-00-02.c4vl7.mongodb.net:27017/mydatabase?replicaSet=atlas-user-shard-0&authSource=admin&retryWrites=true&w=majority";

  if (process.env.USE_LOCAL_DB === "true") {
    return process.env.MONGO_URI_LOCAL || process.env.MONGO_URI || atlasUri;
  }
  return process.env.MONGO_URI || atlasUri;
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