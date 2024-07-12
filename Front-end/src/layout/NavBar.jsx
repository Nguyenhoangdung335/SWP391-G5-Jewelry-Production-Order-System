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
  "/userManager/orders_manager": ["SALE_STAFF", "DESIGN_STAFF", "PRODUCTION_STAFF", "MANAGER", "ADMIN"],
  "/userManager/blogs_manager": ["SALE_STAFF", "MANAGER", "ADMIN"],
  "/userManager/employees_manager": ["MANAGER", "ADMIN"],
  "/userManager/products_manager": ["SALE_STAFF", "MANAGER", "ADMIN"],
  "/userManager/profile": ["SALE_STAFF", "DESIGN_STAFF", "PRODUCTION_STAFF", "MANAGER", "ADMIN"],
  "/userManager/notifications": ["SALE_STAFF", "DESIGN_STAFF", "PRODUCTION_STAFF", "MANAGER", "ADMIN"],
};

const navLinks = [
  { to: "/userManager/dashboard", icon: <MdSpaceDashboard size={22} color="white" />, label: "Dashboard" },
  { to: "/userManager/client_manager", icon: <FaUsers size={22} color="white" />, label: "Clients" },
  { to: "/userManager/orders_manager", icon: <IoMdCart size={22} color="white" />, label: "Orders" },
  { to: "/userManager/blogs_manager", icon: <IoChatboxEllipses size={22} color="white" />, label: "Blogs" },
  { to: "/userManager/employees_manager", icon: <LuUser2 size={22} color="white" />, label: "Employees" },
  { to: "/userManager/products_manager", icon: <FiBox size={22} color="white" />, label: "Products" },
  { to: "/userManager/profile", icon: <FiBox size={22} color="white" />, label: "Profile" },
  { to: "/userManager/notifications", icon: <FiBox size={22} color="white" />, label: "Notifications" },
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
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1 className="display-4 px-5" style={{ fontSize: "2.5rem", color: "white", textAlign: "center" }}>
          宝石店
        </h1>
      </Link>
      <div style={{ marginTop: "10%" }} className="d-flex flex-column gap-3 ">
        {navLinks.map((navLink) =>
          isAllowed(userRole, navLink.to) ? (
            <NavLink
              key={navLink.to}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#444444" : "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                textDecoration: "none",
                paddingLeft: "10%",
                paddingTop: "2%",
                paddingBottom: "2%",
              })}
              to={navLink.to}
            >
              {navLink.icon}
              <p style={{ color: "white", margin: 0, fontSize: 20 }}>{navLink.label}</p>
            </NavLink>
          ) : null
        )}
        <NavLink style={({ isActive }) => ({
                backgroundColor: isActive ? "#444444" : "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                textDecoration: "none",
                paddingLeft: "10%",
                paddingTop: "2%",
                paddingBottom: "2%",
              })}
          to="/login" onClick={() => handleLogout()}
        >
          <IoLogOutOutline size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Log out</p>
        </NavLink>
      </div>
    </>
  );
}
