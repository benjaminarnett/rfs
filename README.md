# rfs (Remote File System)

Rfs is a web application that allows users to store files in the cloud and create associated metadata (such as tags). The application uses modern frontend and backed development tools.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Built With](#built-with)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [To-Do](#to-do)
- [Acknowledgments](#acknowledgments)

## Features

- Remote file storage
- File system navigation (with thumbnails for image files)
- Tagged metadata

## Screenshots

## Built With

- [NodeJS](https://nodejs.org/en/) - Node.js is an open-source, cross-platform JavaScript runtime environment.
  - [Express.js](https://expressjs.com) - Express.js is a minimal and flexible Node.js web application framework.
- [React](https://react.dev/) - React is an open-source front-end JavaScript library for building user interfaces.
  - [React Router](https://reactrouter.com/en/main) - React Router is a lightweight routing library for the React.
  - [Tanstack Query](https://tanstack.com/query/latest) - Tanstack Query is a powerful asynchronous state management for React.
  - [Tailwind CSS](https://tailwindcss.com/) - Tailwind CSS is a utility-first CSS framework.
- [esbuild](https://esbuild.github.io/) - Esbuild is an open-source module bundler and minifier for JavaScript.

## Prerequisites

- [NodeJS](https://nodejs.org/en/) version 21+

## Getting Started

Install and run the backend

```bash
cd backend
npm install
npm run dev
```

Open a seperate CLI, and install and run the frontend

```bash
cd frontend
npm install
npm run dev
```

## To-Do

- Custom metadata attributes
- Metadata querying
- Rendering
  - PDF rendering
  - Text file rendering
- Editing
  - Metadata editing
    - UI elements
    - JSON
  - Text file editing

## Acknowledgments

- [Express.js documentation](https://expressjs.com/en/api.html)
- [React documentation](https://react.dev/reference/react)
- [React Router documentation](https://reactrouter.com/en/main)
- [Tanstack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Tailwind CSS documentation](https://tailwindcss.com/docs/installation)
- [esbuild docmentation](https://esbuild.github.io/api/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
