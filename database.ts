import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongoURI}`, {});
  } catch (err) {
  }
};
