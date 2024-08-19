import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link> | <Link to="/add">Add File</Link>
        </nav>
      </header>
      <div className="flex items-center justify-center">
        <main>
          <Outlet />
        </main>
      </div>
      <footer></footer>
    </div>
  );
}
