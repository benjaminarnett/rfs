import multer from "multer";
import express from "express";
import fs from "fs";
import fsp from "fs/promises";
import { resolve } from "path";
import cors from "cors";
import { fileTypeFromFile } from "file-type";

const filesDir = "files/";
const fileName = "files.json";

// create files.json if doesn't exist and write empty array
if (!fs.existsSync(fileName)) {
  fs.writeFileSync(fileName, "[]");
}

const jsonPath = resolve(fileName);
const files = JSON.parse(fs.readFileSync(jsonPath));

const upload = multer({ dest: filesDir });
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

// return if file already exists in files
function fileDuplicationCheck(checksum) {
  return files.some((file) => file.sha256 === checksum);
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
  res.json({ result: files.find((e) => e.sha256 === req.params.checksum) });
});

app.get("/duplicate/:checksum", (req, res) => {
  res.json({ result: fileDuplicationCheck(req.params.checksum) });
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

  // add file metadata to list
  files.push(req.body);
  // write to files.json
  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2));
  res.json(true);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
