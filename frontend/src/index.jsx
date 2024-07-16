import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './routes/Root'
import FileInput from './routes/FileInput';

if (process.env.NODE_ENV === 'development') {
	new EventSource('/esbuild').addEventListener('change', () => location.reload());
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
      path: "/",
      element: <FileInput />
    },
    {
      path: "/add",
      element: <div>Add Page</div>
    }
]);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
