import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdCart, IoMdNotificationsOutline } from "react-icons/io";
import {
  IoChatboxEllipses,
  IoDiamondOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import logo_white from "./../assets/logo_white.svg";
import { Badge } from "react-bootstrap";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";

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
  // "/userManager/gemstone_manager": [
  //   "ADMIN",
  // ],
  "/user_setting_page/profile_page": [
    "SALE_STAFF",
    "DESIGN_STAFF",
    "PRODUCTION_STAFF",
    "MANAGER",
    "ADMIN",
  ],
  "/user_setting_page/notification_page": [
    "SALE_STAFF",
    "DESIGN_STAFF",
    "PRODUCTION_STAFF",
    "MANAGER",
    "ADMIN",
  ],
};

// Utility function to check if a role is allowed
const isAllowed = (role, path) => {
  return rbacConfig[path]?.includes(role);
};

export default function NavBar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { token, setToken } = useAuth();
  let decodedToken;

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const response = await axios.get(
            `${ServerUrl}/api/notifications/receiver/${decodedToken.id}/unread`
          );
          if (response.data.status === "OK") {
            setUnreadCount(response.data.responseList.notifications.length);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchUnreadNotifications();
  }, [token]);

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const userRole = decodedToken?.role;

  const handleLogout = () => {
    setToken(null);
  };

  const navLinks = [
    {
      id: 1,
      to: "/userManager/dashboard",
      icon: <MdSpaceDashboard size={30} color="white" />,
      label: "Dashboard",
    },
    {
      id: 2,
      to: "/userManager/client_manager",
      icon: <FaUsers size={30} color="white" />,
      label: "Clients",
    },
    {
      id: 3,
      to: "/userManager/orders_manager",
      icon: <IoMdCart size={30} color="white" />,
      label: "Orders",
    },
    // {
    //   id: 4,
    //     to: "/userManager/blogs_manager",
    //   icon: <IoChatboxEllipses size={30} color="white" />,
    //   label: "Blogs",
    // },
    {
      id: 5,
      to: "/userManager/employees_manager",
      icon: <LuUser2 size={30} color="white" />,
      label: "Employees",
    },
    // {
    //   id: 6,
    //   to: "/userManager/products_manager",
    //   icon: <FiBox size={30} color="white" />,
    //   label: "Products",
    // },
    // {
    //   id: 7,
    //   to: "/userManager/gemstone_manager",
    //   icon: <IoDiamondOutline size={30} color="white" />,
    //   label: "Gemstone",
    // },
    {
      id: 8,
      to: "/user_setting_page/profile_page",
      icon: <LuUser2 size={30} color="white" />,
      label: "Profile",
    },
    {
      id: 9,
      to: "/user_setting_page/notification_page",
      icon: (
        <div style={{ position: "relative" }}>
          <IoMdNotificationsOutline size={30} color="white" />
          {unreadCount > 0 && (
            <Badge
              pill
              bg="danger"
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                fontSize: "0.75em",
              }}
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      ),
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="text-center text-decoration-none">
        <Link to="/" className="text-decoration-none text-white">
          <div className="logo-container">
            <img
              src={logo_white}
              alt="logo_white"
              className="logo logo_white"
            />
          </div>
        </Link>
      </div>
      <div className="d-flex flex-column gap-3 mt-4">
        {navLinks.map((navLink) =>
          isAllowed(userRole, navLink.to) ? (
            <div key={navLink.to} className=" side-bar-item side-bar-ltr">
              <NavLink
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
