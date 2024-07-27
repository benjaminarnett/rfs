import { useState, useRef } from "react";
import { isDuplicant, addFile } from "../api/files"

async function getFileChecksum(f) {
  const arrayBuffer = await f.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function FileInput() {
  const [wasDuplicateFile, setWasDuplicateFile] = useState(false)
	const [seed, setSeed] = useState();
  
  const inputName = useRef(null)
  const inputTags = useRef(null)
  var inputFile = null;
  var inputChecksum = null;

	const handleFileChange = async event => {
    const file = event.target.files[0];
    const checksum = await getFileChecksum(file);
    const duplicant = await isDuplicant(checksum);
    if (duplicant) {
        setSeed(Math.random());
        inputFile = null;
        inputChecksum = null;
        setWasDuplicateFile(true);
        setTimeout(() => {
          setWasDuplicateFile(false);
        }, 2000); // 2 seconds
    } else {
        inputFile = file;
        inputChecksum = checksum;
    }
	}

  const handleSubmit = async event => {
    event.preventDefault(); 
    if (inputFile == null || inputChecksum == null) {
      return
    }
    const obj = {
      name: inputName.current.value.trim(),
      tags: inputTags.current.value.split('\n').filter(i => i != '').map(i => i.trim()),
      sha256: inputChecksum
    };
    const res = await addFile(obj, inputFile);
    console.log(res);
  }

  return (
    <>
      {wasDuplicateFile && <div>File already exists</div>}
      <input type="file" id="file" name="file" onChange={handleFileChange} key={seed} required />
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" ref={inputName} />
      </div>
      <div>
        <label htmlFor="tags">Tags (line-seperated):</label><br />
        <textarea name="tags" id="tags" rows="10" cols="40" ref={inputTags} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}