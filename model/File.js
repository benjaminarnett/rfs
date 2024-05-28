import mongoose from "mongoose";
const { Schema, model } = mongoose;

const fileSchema = new Schema({
  name: String,
  creationDate: Date,
  tag: [String],
  url: [String],
  checksum: String,
  filepath: String,
});

const File = model("File", fileSchema);
export default File;
