import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Onboarding Portal</div>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <span className="muted small">({user?.role})</span>
        <button className="btn-link" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;