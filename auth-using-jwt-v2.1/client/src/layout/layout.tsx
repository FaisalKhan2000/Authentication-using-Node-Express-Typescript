import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5100/api/v1/user/logout", {
        withCredentials: true,
      });
      alert("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Logout unsuccessful");
    }
  };

  return (
    <div className="layout-container">
      <nav>
        <h1>Logo</h1>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
