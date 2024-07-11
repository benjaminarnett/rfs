import { useQuery } from "@tanstack/react-query";
import { getFiles } from "../api/files"

export default function Root() {
    const query = useQuery({ queryKey: ['files'], queryFn: getFiles })

    return (
        <>
         <ul>{query.data?.map((file) => <li key={file.checksum}>{file.name}</li>)}</ul>
         <p>Hello World!</p>
        </>
    );
}