import multer from "multer";
import express from "express";
import fs from "fs";
import fsp from "fs/promises";
import { resolve } from "path";
import cors from "cors";
import { fileTypeFromFile } from 'file-type';

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

function fileDuplicationCheck(checksum) {
  var isDuplicateFile = false;
  // iterate through JSON to check whether file already exists
  for (let i = 0; i < files.length; i++) {
    // if checksum value in JSON file equals checksum sent from client
    if (files[i].checksum == checksum) {
      // set duplicate to true
      isDuplicateFile = true;
      // end loop
      break;
    }
  }
  return isDuplicateFile;
}

async function getFileType(file) {
  const fileType = await fileTypeFromFile(file.path);
}

app.post("/add", upload.single("file"), async function (req, res) {
  if (fileDuplicationCheck(req.body.checksum)) {
    res.sendStatus(403);
    return;
  }
  const fileType = await getFileType(req.file)
  // rename file as checksum value
  await fsp.rename(req.file.path, filesDir + req.body.checksum);
  // add file metadata to list
  files.push(req.body)
  // write to files.json
  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2));
  res.sendStatus(200);
});

app.post("/file-duplication-check", (req, res) => {
  const isDuplicateFile = fileDuplicationCheck(req.body.checksum);
  res.json({isDuplicateFile});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
