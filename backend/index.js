import multer from "multer";
import express from "express";
import fs from "fs";
import fsp from "fs/promises";
import { resolve } from "path";
import cors from "cors";

const filesDir = "files/";
const jsonPath = resolve("./files.json");
const files = JSON.parse(fs.readFileSync(jsonPath));

const upload = multer({ dest: filesDir });
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:8080'
}));

app.get("/files", (req, res) => {
  res.json(files);
});

app.post("/add", upload.single("file"), async function (req, res) {
  // rename file as checksum value
  await fsp.rename(req.file.path, filesDir + req.body.checksum);
  // add file metadata to list
  files.push(req.body)
  // write to files.json
  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2));
  res.sendStatus(200);
});

app.post("/check-duplicate", (req, res) => {
  // checksum generated from file on the client and sent as request
  const checksum = req.body.hashHex;
  var duplicate = false;
  // iterate through JSON to check whether file already exists
  for (let i = 0; i < files.length; i++) {
    // if checksum value in JSON file equals checksum sent from client
    if (files[i].checksum == checksum) {
      // set duplicate to true
      duplicate = true;
      // end loop
      break;
    }
  }
  res.json({duplicate});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
