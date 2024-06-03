import files from "./files.json" assert { type: "json" };
import multer from "multer";
import express from "express";

const upload = multer({ dest: "files/" });
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));

var formHTML = `
<form method="POST" action="/add" enctype="multipart/form-data">
  <div>
    <input type="file" id="file" name="file" /><br>
    <input type="text" id="name" name="name" /><br>
    <input type="text" id="description" name="description" />
  </div>
  <div>
    <button>Submit</button>
  </div>
</form>
`;

app.get("/add", (req, res) => {
  res.send(formHTML);
});

app.post("/add", upload.single("file"), function (req, res) {
  console.log(req.file, req.body);
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

app.get("/duplicate", (req, res) => {
  res.send(textHTML);
});

app.post("/duplicate", (req, res) => {
  // checksum generated from file on the client and sent as request
  const checksum = req.body.checksum;
  var duplicate = false;
  // iterate through JSON to check whether file already exists
  for (let i = 0; i < files.length; i++) {
    if (files[i].checksum == checksum) {
      duplicate = true;
      break;
    }
  }
  res.send("File duplicate check");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
