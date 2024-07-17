import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { IoChatboxEllipses, IoLogOutOutline } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";

// Define RBAC configuration
const rbacConfig = {
  "/userManager/dashboard": ["ADMIN"],
  "/userManager/client_manager": ["MANAGER", "ADMIN"],
  "/userManager/orders_manager": [
    "SALE_STAFF",
    "DESIGN_STAFF",
    "PRODUCTION_STAFF",
    "MANAGER",
    "ADMIN",
  ],
  "/userManager/blogs_manager": ["SALE_STAFF", "MANAGER", "ADMIN"],
  "/userManager/employees_manager": ["MANAGER", "ADMIN"],
  "/userManager/products_manager": ["SALE_STAFF", "MANAGER", "ADMIN"],
  "/userManager/profile": [
    "SALE_STAFF",
    "DESIGN_STAFF",
    "PRODUCTION_STAFF",
    "MANAGER",
    "ADMIN",
  ],
  "/userManager/notifications": [
    "SALE_STAFF",
    "DESIGN_STAFF",
    "PRODUCTION_STAFF",
    "MANAGER",
    "ADMIN",
  ],
};

const navLinks = [
  {
    to: "/userManager/dashboard",
    icon: <MdSpaceDashboard size={30} color="white" />,
    label: "Dashboard",
  },
  {
    to: "/userManager/client_manager",
    icon: <FaUsers size={30} color="white" />,
    label: "Clients",
  },
  {
    to: "/userManager/orders_manager",
    icon: <IoMdCart size={30} color="white" />,
    label: "Orders",
  },
  {
    to: "/userManager/blogs_manager",
    icon: <IoChatboxEllipses size={30} color="white" />,
    label: "Blogs",
  },
  {
    to: "/userManager/employees_manager",
    icon: <LuUser2 size={30} color="white" />,
    label: "Employees",
  },
  {
    to: "/userManager/products_manager",
    icon: <FiBox size={30} color="white" />,
    label: "Products",
  },
];

// Utility function to check if a role is allowed
const isAllowed = (role, path) => {
  return rbacConfig[path]?.includes(role);
};

export default function NavBar() {
  const { token, setToken } = useAuth();
  let decodedToken;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const userRole = decodedToken?.role;

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <>
      <div className="text-center text-decoration-none">
        <Link to="/" className="text-decoration-none text-white">
          <h1 className="fw-bold">宝石店</h1>
        </Link>
      </div>
      <div className="d-flex flex-column gap-3 mt-4">
        {navLinks.map((navLink) =>
          isAllowed(userRole, navLink.to) ? (
            <div className=" side-bar-item side-bar-ltr">
              <NavLink
                key={navLink.to}
                style={({ isActive }) => ({
                  backgroundColor: isActive
                    ? "rgb(125, 125, 125)"
                    : "transparent",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  textDecoration: "none",
                  padding: "15px 30px 9px",
                  color: "white",
                })}
                to={navLink.to}
              >
                {navLink.icon}
                <h5>{navLink.label}</h5>
              </NavLink>
            </div>
          ) : null
        )}
        <div className=" side-bar-item side-bar-ltr">
          <NavLink
            style={({ isActive }) => ({
              backgroundColor: isActive ? "rgb(125, 125, 125)" : "transparent",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              textDecoration: "none",
              padding: "15px 30px 9px",
            })}
            to="/login"
            onClick={() => handleLogout()}
          >
            <IoLogOutOutline size={30} color="white" />
            <h5 style={{ color: "white", margin: 0, fontSize: 20 }}>Log out</h5>
          </NavLink>
        </div>
      </div>
    </>
  );
}
