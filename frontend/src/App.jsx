import { useState } from "react";

function FileInput () {
    const [isDuplicate, setIsDuplicate] = useState();
<<<<<<< HEAD
=======
    const [fileChecksum, setFileChecksum] = useState();
>>>>>>> develop

    handleFileChange = async event => {
        const file = event.target.files[0];
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
<<<<<<< HEAD
=======
        setFileChecksum(hashHex)
>>>>>>> develop

        const response = await fetch('http://localhost:3000/check-duplicate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hashHex})
        });
        const data = await response.json();
        const duplicate = data.duplicate
        setIsDuplicate(duplicate)
    }

    return (
        <>
            <form id="fileForm" action="http://localhost:3000/add" method="POST" enctype="multipart/form-data">
                <input type="file" id="file" name="file" onChange={this.handleFileChange} />
                {isDuplicate ? <div>*File already exists</div> : (
                    <>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" />
                        </div>
<<<<<<< HEAD
                        <input type="hidden" id="checksum" name="checksum" value="3487" />
=======
                        <input type="hidden" id="checksum" name="checksum" value={fileChecksum} />
>>>>>>> develop
                        <input type="submit" value="Submit"></input>
                    </>
                )}
            </form>
        </>
    );
}

export default function App() {
    return (
        <>
         <FileInput />
        </>
    );
}