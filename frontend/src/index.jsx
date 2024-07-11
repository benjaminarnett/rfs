import React from 'react';
import { createRoot } from 'react-dom/client';
import { useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './routes/Root'

if (process.env.NODE_ENV === 'development') {
	new EventSource('/esbuild').addEventListener('change', () => location.reload());
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
]);

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
