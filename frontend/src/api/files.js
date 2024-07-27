export async function getFiles() {
  const response = await fetch('http://localhost:3000/files');
  const jsonArr = await response.json();
  return jsonArr;
}

export async function isDuplicant(checksum) {
  const response = await fetch('http://localhost:3000/file-duplication-check', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checksum })
  }); 
  const data = await response.json();
  return data.result;
}

export async function addFile(metadata, file) {
  const formData = new FormData();
  formData.append('file', file);
  Object.keys(metadata).forEach(key => {
    formData.append(key, metadata[key]);
  });

  const response = await fetch('http://localhost:3000/add', {
    method: 'POST',
    body: formData
  }); 
  const data = await response.json();
  return data
}