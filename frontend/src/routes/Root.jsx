import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getFiles } from "../api/files"

function ListFiles() {
    const query = useQuery({ queryKey: ['files'], queryFn: getFiles })

    return (
        <>
         {query.data?.map((file) => <Link key={file.checksum} to="https://www.w3schools.com/">{file.name}</Link>)}
        </>
    );
}

export default function Root() {
    return (
        <>
            <ListFiles />
        </>
    );
}