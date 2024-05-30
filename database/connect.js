import mongoose from "mongoose";
try {
  await mongoose.connect(process.env.URI_MONGO);
  console.log("ok");
} catch (error) {
  console.error("error" + error);
}
