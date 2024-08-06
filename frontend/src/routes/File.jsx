import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileMetadata } from "../api/files";

export default function File() {
  let { sha256 } = useParams();
  const { data } = useQuery({
    queryKey: ["fileMetadata", sha256],
    queryFn: () => getFileMetadata(sha256),
  });

  return (
    <>
      {data && (
        <>
          <p>Hello World!</p>
          <p>File SHA: {data.sha256}</p>
          <p>File SHA: {data.name}</p>
        </>
      )}
    </>
  );
}

//https://react.dev/learn/passing-props-to-a-component
