import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Root from "./routes/Root";
import FileInput from "./routes/FileInput";
import File from "./routes/File";

if (process.env.NODE_ENV === "development") {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload()
  );
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "/add",
        element: <FileInput />,
      },
      {
        path: "file/:sha256",
        element: <File />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
