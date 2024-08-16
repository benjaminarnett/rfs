export async function getFileData(checksum) {
  var metadataResponse = await fetch(
    `http://localhost:3000/metadata/${checksum}`
  );
  metadataResponse = await metadataResponse.json();
  var fileResponse = await fetch(`http://localhost:3000/file/${checksum}`);
  if (fileResponse.status === 200) {
    fileResponse = await fileResponse.blob();
  } else {
    fileResponse = null;
  }
  return { metadata: metadataResponse, file: fileResponse };
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
