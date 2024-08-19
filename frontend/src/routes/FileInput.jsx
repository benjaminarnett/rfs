import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getIsDuplicate, addFile } from "../api/files";

async function getFileChecksum(f) {
  // create ArrayBuffer object
  const arrayBuffer = await f.arrayBuffer();
  // create digest, short fixed-length value generated from hash function (SHA-256)
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  // create shallow-copied array of Uint8Array object
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function FileInput() {
  const navigate = useNavigate();
  const [wasDuplicateFile, setWasDuplicateFile] = useState(false);
  const [seed, setSeed] = useState();

  const inputName = useRef(null);
  const inputTags = useRef(null);
  var inputFile;
  var inputChecksum;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const checksum = await getFileChecksum(file);
    const duplicant = await getIsDuplicate(checksum);
    // if file is a duplicate (already exists on server)
    if (duplicant) {
      // reset file input, remove current selected file
      setSeed(Math.random());
      inputFile = null;
      inputChecksum = null;
      // render "File already exists" feedback
      setWasDuplicateFile(true);
      setTimeout(() => {
        // remove feedback after 2 seconds
        setWasDuplicateFile(false);
      }, 2000);
    } else {
      inputFile = file;
      inputChecksum = checksum;
    }
  };

  const handleSubmit = async () => {
    // if file or checksum do not exist
    if (!(inputFile && inputChecksum)) {
      // end function execution
      return;
    }
    const obj = {
      name: inputName.current.value.trim(),
      tags: inputTags.current.value
        .split("\n")
        .filter((i) => i != "")
        .map((i) => i.trim()),
      sha256: inputChecksum,
    };
    const res = await addFile(obj, inputFile);
    // if file successfully added to server
    if (res.status === 201) {
      navigate(`/file/${inputChecksum}`);
    }
  };

  return (
    <>
      {wasDuplicateFile && <div>File already exists</div>}
      <input
        type="file"
        id="file"
        name="file"
        onChange={handleFileChange}
        key={seed}
        required
      />
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="off"
          ref={inputName}
        />
      </div>
      <div>
        <label htmlFor="tags">Tags (line-seperated):</label>
        <br />
        <textarea name="tags" id="tags" rows="10" cols="40" ref={inputTags} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
