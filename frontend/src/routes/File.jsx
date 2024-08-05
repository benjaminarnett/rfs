import { useParams } from "react-router-dom";
import { getFileMetadata } from "../api/files";

export default function File() {
  let { sha256 } = useParams();

  return (
    <>
      <p>Hello World!</p>
      <p>File SHA: {sha256}</p>
    </>
  );
}

//https://react.dev/learn/passing-props-to-a-component
