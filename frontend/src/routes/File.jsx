import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileData, deleteFile } from "../api/files";

export default function File() {
  const navigate = useNavigate();
  let { sha256 } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fileData", sha256],
    queryFn: () => getFileData(sha256),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const del = async () => {
    const result = confirm("Are you sure you want to delete this file?");
    if (result) {
      const res = await deleteFile(data.metadata.sha256);
      if (res.status === 200) {
        navigate("/");
      }
    }
  };

  return (
    <>
      {data && (
        <>
          {data.file && (
            <img
              style={{ maxWidth: "50%" }}
              src={URL.createObjectURL(data.file)}
              alt={data.metadata.name}
            />
          )}
          <p>
            File path: {data.metadata.sha256}.{data.metadata.fileExt}
          </p>
          {data.metadata.name && <p>Name: {data.metadata.name}</p>}
          {data.metadata.tags && (
            <ul>
              {data.metadata.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          )}
        </>
      )}
      <button onClick={del}>Delete</button>
    </>
  );
}
