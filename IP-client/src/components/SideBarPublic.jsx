import { NavLink, useNavigate } from "react-router";
import "../assets/styles/global.css";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import uniqloLogo from "../../public/uniqloLogo.png";

export default function SideBarPublic() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
    toast.success("You are logged out");
  };
  return (
    <nav
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      id="sidebar-menu"
    >
      <div className="position-sticky pt-3">
        {/* Logo Section */}
        <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
          <a href="/pub/products" className="d-block">
            <img
              src={uniqloLogo}
              alt="UNIKLOH_logo"
              style={{
                width: "120px",
                height: "auto",
                cursor: "pointer",
              }}
            />
          </a>
        </div>
        <h6 style={{ marginLeft: "20px" }}>Public Site</h6>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/pub/products"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                shopping_bag
              </span>
              All Products
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                account_circle
              </span>
              Login
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
