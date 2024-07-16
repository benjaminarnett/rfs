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

async function getFileType(filePath, fileName) {
  var fileType = await fileTypeFromFile(filePath);
  if (fileType != undefined) {
    fileType = "." + fileType.ext;
    return fileType;
  }
  try {
    var extArray = fileName.split('.');
    const [head, ...tail] = extArray;
    extArray = tail.filter(str => str !== "")
    if (extArray.length == 0) {
        throw "error";
    }
    fileType = "." + extArray.join(".")
  } catch (error) {
    fileType = "";
  }
  return fileType;
}

app.post("/add", upload.single("file"), async function (req, res) {
  if (fileDuplicationCheck(req.body.checksum)) {
    res.sendStatus(403);
    return;
  }
  const fileType = await getFileType(req.file.path, req.file.originalname)
  // rename file as checksum value
  const newPath = filesDir + req.body.checksum + fileType;
  await fsp.rename(req.file.path, newPath);
  req.body.path = newPath;
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
