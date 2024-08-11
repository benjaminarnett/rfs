import multer from "multer";
import express from "express";
import fs from "fs";
import fsp from "fs/promises";
import { resolve } from "path";
import { fileTypeFromFile } from "file-type";

const filesDir = "files/";
const fileName = "files.json";

// create files.json if doesn't exist and write empty array
if (!fs.existsSync(fileName)) {
  fs.writeFileSync(fileName, "[]");
}

const jsonPath = resolve(fileName);
var files = JSON.parse(fs.readFileSync(jsonPath));

const upload = multer({ dest: filesDir });
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// return if file already exists in files (boolean)
function fileDuplicationCheck(checksum) {
  return files.some((obj) => obj.sha256 === checksum);
}

function fileMetadata(checksum) {
  return files.find((obj) => obj.sha256 === checksum);
}

// return file extension
async function getFileExtension(filePath, fileName) {
  // call function to return type
  var fileType = await fileTypeFromFile(filePath);
  // if supported file type (binary-based format)
  if (fileType) return fileType.ext;
  try {
    var extArray = fileName.split(".");
    const [head, ...tail] = extArray;
    extArray = tail.filter((str) => str !== "");
    if (extArray.length == 0) {
      throw "error";
    }
    fileType = extArray.join(".");
  } catch (error) {
    fileType = "";
  }
  return fileType;
}

/* GET */

app.get("/metadata/:checksum", (req, res) => {
  res.json(fileMetadata(req.params.checksum));
});

app.get("/duplicate/:checksum", (req, res) => {
  res.json(fileDuplicationCheck(req.params.checksum));
});

/* POST */

app.post("/add", upload.single("file"), async function (req, res) {
  if (fileDuplicationCheck(req.body.sha256)) {
    res.sendStatus(403);
    return;
  }
  const fileExt = await getFileExtension(req.file.path, req.file.originalname);
  const extension = fileExt == "" ? fileExt : "." + fileExt;
  // rename file as checksum value
  const newPath = filesDir + req.body.sha256 + extension;
  await fsp.rename(req.file.path, newPath);
  req.body.fileExt = fileExt;
  console.log(req.body.tags);
  if (req.body.tags) {
    req.body.tags = req.body.tags.split(",");
  }
  // add file metadata to list
  files.push(req.body);
  // write to files.json
  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2));
  res.sendStatus(201);
});

/* DELETE */

app.delete("/delete/:checksum", (req, res) => {
  var ext = fileMetadata(req.params.checksum).fileExt;
  if (ext) {
    ext = "." + ext;
  }
  files = files.filter((obj) => obj.sha256 !== req.params.checksum);
  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2));
  fs.unlinkSync(filesDir + req.params.checksum + ext);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
