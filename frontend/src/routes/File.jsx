import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileMetadata, deleteFile } from "../api/files";

export default function File() {
  const navigate = useNavigate();
  let { sha256 } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fileMetadata", sha256],
    queryFn: () => getFileMetadata(sha256),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const del = async () => {
    const result = confirm("Are you sure you want to delete this file?");
    if (result) {
      const res = await deleteFile(data.sha256);
      if (res.status === 200) {
        navigate("/");
      }
    }
  };

  return (
    <>
      {data && (
        <>
          <p>
            File path: {data.sha256}.{data.fileExt}
          </p>
          {data.name && <p>Name: {data.name}</p>}
          {data.tags && (
            <ul>
              {data.tags.map((tag, index) => (
                <li key={index}>tag</li>
              ))}
            </ul>
          )}
        </>
      )}
      <button onClick={del}>Delete</button>
    </>
  );
}
