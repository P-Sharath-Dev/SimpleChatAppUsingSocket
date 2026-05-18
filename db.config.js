import mongoose from "mongoose";

export async function connectToDB() {
  try {
    const dbUrl =
      "mongodb+srv://testUser:Password1@cluster0.sdx6jzr.mongodb.net/simpleChat?appName=Cluster0";
    await mongoose.connect(dbUrl);
    console.log("connected to db using mongoose");
  } catch (e) {
    console.log("error in connecting to db => ", e);
  }
}
