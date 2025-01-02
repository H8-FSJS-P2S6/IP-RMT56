import { NavLink, useNavigate } from "react-router";
import "../assets/styles/global.css";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import uniqloLogo from "../../public/uniqloLogo.png";

export default function SideBar() {
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
        <div style={{ marginBottom: "20px" }}>
          <a href="/products" className="d-block">
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
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                shopping_bag
              </span>
              Back To Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                shopping_bag
              </span>
              My Shopping Cart
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                shopping_bag
              </span>
              View My Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                shopping_bag
              </span>
              Chat with us
            </NavLink>
          </li>
        </ul>
        <h6 className="sidebar-heading d-flex justify-content-left align-items-center px-3 mt-4 mb-1 text-muted text-uppercase"></h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <a
              onClick={handleLogout}
              className="nav-link"
              id="nav-logout"
              style={{ cursor: "pointer" }}
            >
              <span className="icon material-symbols-outlined me-2">
                logout
              </span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
// SideBar.propTypes = {
//   user: PropTypes.shape({
//     role: PropTypes.string.isRequired, // e.g., "Admin" or "Staff"
//     email: PropTypes.string.isRequired, // e.g., "user@example.com"
//   }).isRequired,
// };
