import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileMetadata } from "../api/files";

export default function File() {
  let { sha256 } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fileMetadata", sha256],
    queryFn: () => getFileMetadata(sha256),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
    </>
  );
}

/*
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileMetadata } from "../api/files";

export default function File() {
  let { sha256 } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fileMetadata", sha256],
    queryFn: () => getFileMetadata(sha256),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {data && (
        <>
          <p>
            File path: {data.sha256}.{data.fileExt}
          </p>
        </>
      )}
    </>
  );
}
*/

/*
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileMetadata } from "../api/files";

export default function File() {
  let { sha256 } = useParams();

  async function query() {
    const res = await getFileMetadata(sha256);
    console.log(res);
  }

  return (
    <>
      <p>Hello</p>
      <button onClick={query}>query</button>
    </>
  );
}


*/
