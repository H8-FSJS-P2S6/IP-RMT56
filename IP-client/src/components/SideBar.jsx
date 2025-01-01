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
        <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
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
        <h6 style={{ marginLeft: "20px" }}>Admin Panel</h6>
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
              Products
            </NavLink>
          </li>
          {/* Conditional Rendering for "Add User" */}
          {/* {user.role.toLowerCase() === "admin" && (
            <li className="nav-item">
              <NavLink
                to="/admin/add-user"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="icon material-symbols-outlined me-2">
                  account_circle
                </span>
                Add User
              </NavLink>
            </li>
          )} */}
          <li className="nav-item">
            <NavLink
              to="/admin/add-user"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                account_circle
              </span>
              Add User
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                category
              </span>
              Categories{" "}
            </NavLink>
          </li>
        </ul>
        <h6 className="sidebar-heading d-flex justify-content-left align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
          <span>Account</span>
        </h6>
        <ul className="nav flex-column mb-2">
          {/* <li className="nav-item">
            <a className="nav-link">
              {" "}
              <span className="icon material-symbols-outlined me-2">
                person
              </span>
              Welcome Back <span id="username"></span>
            </a>
          </li> */}
          <li className="nav-item">
            <NavLink
              to="/pub/products"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon material-symbols-outlined me-2">
                public
              </span>
              View Public Site{" "}
            </NavLink>
          </li>
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
