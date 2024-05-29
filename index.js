import mongoose from "mongoose";
import File from "./model/File.js";

// const db = mongoose.connect("mongodb://localhost/database");

mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

/*

const file = new File({
  name: "yea",
});

await file.save();

const firstFile = await File.findOne({});
console.log(firstFile);

*/
