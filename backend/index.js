import express from "express";
import multer from "multer";
import fs from "fs";
import { fileTypeFromFile } from "file-type";

const app = express();
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

const PORT = 3000;
const JSON_FILE = "files.json";
const FILE_DIRECTORY = "files/";
const UPLOAD = multer({ dest: FILE_DIRECTORY });

// create JSON file if none exists
try {
  // access JSON file
  await fs.promises.access(JSON_FILE);
} catch (error) {
  // log error
  console.log(error);
  // write empty array to JSON file
  await fs.promises.writeFile(JSON_FILE, "[]");
}

// store array of JSON file in variable
try {
  // read contents of JSON file
  var files = await fs.promises.readFile(JSON_FILE);
  // parse as JSON
  files = JSON.parse(files);
} catch (error) {
  // log error
  console.log(error);
}

// return if file checksum already exists in JSON file
function fileDuplicate(checksum) {
  // return true if checksum argument equals sha256 value of at least one object in array
  return files.some((obj) => obj.sha256 === checksum);
}

// return file metadata in JSON file
function fileMetadata(checksum) {
  // return first object in which checksum argument equals sha256 value of object in array
  return files.find((obj) => obj.sha256 === checksum);
}

async function getFileExtension(filePath, fileName) {
  // get object containing file extension and MIME type, undefined if not support type (text)
  let fileType = await fileTypeFromFile(filePath);
  let fileExtension;
  // if file is supported type (binary)
  if (fileType) {
    fileExtension = fileType.ext;
  } else {
    // create array of substrings, split at '.' seperator
    let extArray = fileName.split(".");
    // remove first element of array, the filename without extension
    extArray = extArray.slice(1);
    // remove empty string elements from array
    extArray = extArray.filter((str) => str !== "");
    // concatenate elements of array if not empty
    fileExtension = extArray.length === 0 ? "" : extArray.join(".");
  }
  return fileExtension;
}

/* GET */

app.get("/files", (req, res) => {
  res.json(files);
});

app.get("/duplicate/:checksum", (req, res) => {
  // send true (boolean) if file is duplicate, false if not
  res.json(fileDuplicate(req.params.checksum));
});

app.get("/metadata/:checksum", (req, res) => {
  // send file metadata object
  res.json(fileMetadata(req.params.checksum));
});

app.get("/file/:checksum", async (req, res) => {
  // assign ext as file extension of checksum associated file
  let ext = fileMetadata(req.params.checksum).fileExt;
  // concatenate '.' to extension if ext is not empty
  ext &&= "." + ext;
  // create file path
  let filePath = FILE_DIRECTORY + req.params.checksum + ext;
  // get object containing file extension and MIME type
  let fileType = await fileTypeFromFile(filePath);
  // if fileType is undefined or is not image
  if (!fileType || !fileType.mime.startsWith("image/")) {
    // send 204 No Content successful response
    res.sendStatus(204);
  } else {
    // send file
    res.sendFile(filePath, { root: "." });
  }
});

/* POST */

app.post("/add", UPLOAD.single("file"), async (req, res) => {
  // if file already exists in JSON file, send 403 Forbidden client error response
  fileDuplicate(req.body.sha256) && res.sendStatus(403).end();
  let ext = await getFileExtension(req.file.path, req.file.originalname);
  // concatenate '.' to extension if not empty
  let fileExtension = ext && "." + ext;
  // rename file as checksum value plus extension
  await fs.promises.rename(
    req.file.path,
    FILE_DIRECTORY + req.body.sha256 + fileExtension
  );
  // assign ext as file extension value
  req.body.fileExt = ext;
  // create array of tags if tags exists
  req.body.tags &&= req.body.tags.split(",");
  // add file metadata object to array
  files.push(req.body);
  // write metadata array to JSON file
  await fs.promises.writeFile(
    JSON_FILE,
    JSON.stringify(files, null, 2),
    "utf8"
  );
  // send 201 Created successful response
  res.sendStatus(201);
});

/* DELETE */

// delete file and metadata object in JSON file
app.delete("/delete/:checksum", async (req, res) => {
  // assign ext as file extension of checksum associated file
  let ext = fileMetadata(req.params.checksum).fileExt;
  // concatenate '.' to extension if ext is not empty
  ext &&= "." + ext;
  // remove metadata object from array
  files = files.filter((obj) => obj.sha256 !== req.params.checksum);
  // write metadata array to JSON file
  await fs.promises.writeFile(
    JSON_FILE,
    JSON.stringify(files, null, 2),
    "utf8"
  );
  // remove file from file directory
  fs.unlinkSync(FILE_DIRECTORY + req.params.checksum + ext);
  // send 200 OK successful response
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
