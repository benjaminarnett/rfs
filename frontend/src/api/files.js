export async function getFileMetadata(checksum) {
  const response = await fetch(`http://localhost:3000/metadata/${checksum}`);
  const data = await response.json();
  return data;
}

export async function getIsDuplicate(checksum) {
  const response = await fetch(`http://localhost:3000/duplicate/${checksum}`);
  const data = await response.json();
  return data;
}

export async function addFile(metadata, file) {
  const formData = new FormData();
  formData.append("file", file);
  Object.keys(metadata).forEach((key) => {
    formData.append(key, metadata[key]);
  });
  const response = await fetch("http://localhost:3000/add", {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function deleteFile(checksum) {
  const response = await fetch(`http://localhost:3000/delete/${checksum}`, {
    method: "DELETE",
  });
  return response;
}
