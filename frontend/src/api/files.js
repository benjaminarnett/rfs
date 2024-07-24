export async function getFiles() {
  const response = await fetch('http://localhost:3000/files');
  const jsonArr = await response.json();
  return jsonArr;
}

export async function apiFileDuplication(checksum) {
  const response = await fetch('http://localhost:3000/file-duplication-check', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checksum })
  }); 
  const data = await response.json();
  console.log(data)


  
  return data.isDuplicateFile;
}