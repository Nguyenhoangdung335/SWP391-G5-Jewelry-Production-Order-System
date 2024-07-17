import React from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../provider/AuthProvider";
import { LuUser2 } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

function SideBar() {
  const { token, setToken } = useAuth();
  let decodedToken;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  console.log(decodedToken);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const navLinks = [
    {
      to: "/user_setting_page",
      icon: <LuUser2 size={30} color="white" />,
      label: "Profile",
    },
    {
      to: "/user_setting_page/notification_page",
      icon: <IoMdNotificationsOutline size={30} color="white" />,
      label: "Notifications",
    },
  ];

  const orderHistory = {
    to: "/user_setting_page/order_history_page",
    icon: <MdHistory size={30} color="white" />,
    label: "Orders History",
  };

  if (decodedToken.role === "CUSTOMER") {
    navLinks.push(orderHistory);
  }

  return (
    <>
      <div className="text-center text-decoration-none">
        <Link to="/" className="text-decoration-none text-white">
          <h1 className="fw-bold">宝石店</h1>
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
