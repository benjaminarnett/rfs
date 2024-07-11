export async function getFiles() {
  const response = await fetch('http://localhost:3000/files');
  const jsonArr = await response.json();
  return jsonArr
}