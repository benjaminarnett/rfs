import mongoose from "mongoose";
const { Schema, model } = mongoose;

const fileSchema = new Schema({
  name: String,
  description: String,
  dateAdded: Date,
  datePublished: Date,
  group: {
    id: Schema.Types.UUID,
    index: Number,
  },
  tag: [String],
  url: [String],
  checksum: String,
  filepath: String,
});

const File = model("File", fileSchema);
export default File;
