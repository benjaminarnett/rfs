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
    // ask user to confirm file deletion
    const result = confirm("Are you sure you want to delete this file?");
    // if user confirms
    if (result) {
      // delete file
      const res = await deleteFile(data.metadata.sha256);
      // if request succeeds, redirect to home page
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
              src={URL.createObjectURL(data.file)}
              alt={data.metadata.name}
            />
          )}
          <p>
            File path: {data.metadata.sha256}.{data.metadata.fileExt}
          </p>
          {data.metadata.name && <p>Name: {data.metadata.name}</p>}
          {data.metadata.tags && (
            <div>
              Tags:
              <br />
              {data.metadata.tags.map((tag, index) => (
                <span key={index} className="mr-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
      <button onClick={del}>Delete</button>
    </>
  );
}
