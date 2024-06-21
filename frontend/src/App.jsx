import { useState } from "react";




function Button () {
    const [isDuplicate, setIsDuplicate] = useState();

    handleFileChange = async event => {
        const file = event.target.files[0];
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        console.log(hashHex);

        const response = await fetch('http://localhost:3000/check-duplicate', {
            method: 'POST',
            body: JSON.stringify(hashHex)
        });
        const data = await response.json();
        const duplicate = data.duplicate
        console.log(duplicate)

    }

    return (
        <>
            <input type="file" id="file" name="file" onChange={this.handleFileChange} />
            {!isDuplicate && <div>*File already exists</div>}
        </>
    );
}







export default function App() {
    return (
        <>
         <Button />
        </>
    );
}