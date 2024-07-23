import { useState } from "react";
import { fileDuplicationCheck } from "../api/files"

async function getFileChecksum(f) {
  const arrayBuffer = await f.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function FileInput () {
	const [file, setFile] = useState();
	const [fileChecksum, setFileChecksum] = useState("");

	const [seed, setSeed] = useState();
	const [isDuplicateFile, setIsDuplicateFile] = useState(false)

	const handleFileChange = async event => {
    const inputFile = event.target.files[0];
    const checksum = await getFileChecksum(inputFile);
    const isDuplicateFile = await fileDuplicationCheck(checksum);
    if (isDuplicateFile) {
        setSeed(Math.random());
        setIsDuplicateFile(true);
            setTimeout(() => {
            setIsDuplicateFile(false);
        }, 2000); // 1 second
    } else {
        setFile(inputFile);
        setFileChecksum(checksum);
    }
	}



  return (
    <>
      {isDuplicateFile && <div>File already exists</div>}
      <form id="fileForm" onSubmit={handleSubmit}>
        <input type="file" id="file" name="file" onChange={handleFileChange} key={seed} />
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" />
          </div>
          <div>
            <label for="tags">Tags (line-seperated):</label><br />
            <textarea name="tags" id="tags" rows="10" cols="40"></textarea>
          </div>
          <input type="hidden" id="checksum" name="checksum" value={fileChecksum} />
          <input type="submit" value="Submit"></input>
      </form>
    </>
  );
}