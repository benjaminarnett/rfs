import multer from "multer";
import express from "express";
import { readFileSync, writeFileSync, createReadStream, rename } from "fs";
import fs from "fs/promises";
import { resolve } from "path";
import { fileTypeFromStream } from "file-type";
import cors from "cors";

const filesDir = "files/";
const jsonPath = resolve("./files.json");
const files = JSON.parse(readFileSync(jsonPath));

const upload = multer({ dest: filesDir });
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:8080'
}));


var formHTML = `
<form method="POST" action="/add" enctype="multipart/form-data">
  <div>
    <input type="file" id="file" name="file" /><br>
    <input type="text" id="name" name="name" /><br>
    <input type="text" id="checksum" name="checksum" />
  </div>
  <div>
    <button>Submit</button>
  </div>
</form>
`;

app.get("/add", (req, res) => {
  res.send(formHTML);
});

app.post("/add", upload.single("file"), async function (req, res) {
  //console.log(req.file, req.body);

  const stream = createReadStream(req.file.path);
  var fileType = await fileTypeFromStream(stream);
  fileType = fileType.ext;

  await fs.rename(req.file.path, filesDir + req.body.checksum + "." + fileType);

  //files.push(req.body);
  //write file metadata to files.json
  //writeFileSync(jsonPath, JSON.stringify(files, null, 2));
  res.send("File duplicate check");
});

var textHTML = `
<form method="POST" action="/duplicate">
  <div>
    <input type="text" id="checksum" name="checksum" />
  </div>
  <div>
    <button>Submit</button>
  </div>
</form>
`;

app.get("/check-duplicate", (req, res) => {
  res.send(textHTML);
});

app.post("/check-duplicate", (req, res) => {
  // checksum generated from file on the client and sent as request
  console.log('request recieved');
  const checksum = req.body;
  var duplicate = false;
  // iterate through JSON to check whether file already exists
  for (let i = 0; i < files.length; i++) {
    if (files[i].checksum == checksum) {
      duplicate = true;
      console.log(files[i]);
      break;
    }
  }
  console.log(duplicate)
  res.json({duplicate});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
