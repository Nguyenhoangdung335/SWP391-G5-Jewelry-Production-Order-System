import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../provider/AuthProvider";
import { MdHistory, MdOutlineDashboard } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { Badge } from "react-bootstrap";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import logo_white from "./../assets/logo_white.svg";
import { AiOutlineProfile } from "react-icons/ai";

function SideBar() {
  const { token, setToken } = useAuth();
  let decodedToken;
  const [unreadCount, setUnreadCount] = useState(0);

  if (token) {
    decodedToken = jwtDecode(token);
  }

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const navLinks = [
    {
      to: "/user_setting_page/profile_page",
      icon: <AiOutlineProfile size={30} color="white" />,
      label: "Profile",
    },
    {
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

  const orderHistory = {
    to: "/user_setting_page/order_history_page",
    icon: <MdHistory size={30} color="white" />,
    label: "Orders History",
  };
  const userManager = {
    to: "/userManager",
    icon: <MdOutlineDashboard size={30} color="white" />,
    label: "Management",
  };

  if (decodedToken.role === "CUSTOMER") {
    navLinks.push(orderHistory);
  }

  if (decodedToken.role !== "CUSTOMER") {
    navLinks.push(userManager);
  }

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
        {navLinks.map((navLink) => (
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
        ))}
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

export default SideBar;
