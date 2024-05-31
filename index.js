import fs from "fs";

// check if file already exists via checksum
// calcualte sha512 of file
// if calculated value exists in data.json -> reject addition, if not -> add

const writeStream = fs.createWriteStream("data.json");
writeStream.write("Hello, world!\n");

/* 
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
*/
