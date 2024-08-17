export async function getFiles() {
  let response = await fetch(`http://localhost:3000/files`);
  response = await response.json();
  return response;
}

export async function getIsDuplicate(checksum) {
  let response = await fetch(`http://localhost:3000/duplicate/${checksum}`);
  response = await response.json();
  // return boolean
  return response;
}

export async function getFileData(checksum) {
  let metadataResponse = await fetch(
    `http://localhost:3000/metadata/${checksum}`
  );
  metadataResponse = await metadataResponse.json();
  let fileResponse = await fetch(`http://localhost:3000/file/${checksum}`);
  if (fileResponse.status === 200) {
    fileResponse = await fileResponse.blob();
  } else {
    fileResponse = null;
  }
  return { metadata: metadataResponse, file: fileResponse };
}

export async function addFile(metadata, file) {
  let formData = new FormData();
  formData.append("file", file);
  Object.keys(metadata).forEach((key) => {
    formData.append(key, metadata[key]);
  });
  let response = await fetch("http://localhost:3000/add", {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function deleteFile(checksum) {
  let response = await fetch(`http://localhost:3000/delete/${checksum}`, {
    method: "DELETE",
  });
  return response;
}
