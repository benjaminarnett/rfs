import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getFiles } from "../api/files";

export default function Root() {
  const obj = useQuery({ queryKey: ["files"], queryFn: getFiles });
  const data = obj.data;

  return (
    <>
      {data &&
        data.map((file, index) => (
          <div key={index}>
            <Link key={file.sha256} to={`/file/${file.sha256}`}>
              {file.sha256}
            </Link>
          </div>
        ))}
    </>
  );
}
