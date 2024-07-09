import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { useAuth } from "../provider/AuthProvider";

export default function NavBar() {
  return (
    <>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1
          className="display-4 px-5"
          style={{ fontSize: "2.5rem", color: "white", textAlign: "center" }}
        >
          宝石店
        </h1>
      </Link>
      <div style={{ marginTop: "10%" }} className="d-flex flex-column gap-3 ">
        <NavLink
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
          to="/userManager/dashboard"
        >
          <MdSpaceDashboard size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Dashboard</p>
        </NavLink>
        <NavLink
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
          to="/userManager/client_manager"
        >
          <FaUsers size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Clients</p>
        </NavLink>
        <NavLink
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
          to="/userManager/orders_manager"
        >
          <IoMdCart size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Orders</p>
        </NavLink>
        <NavLink
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
          to="/userManager/blogs_manager"
        >
          <IoChatboxEllipses size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Blogs</p>
        </NavLink>
        <NavLink
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
          to="/userManager/employees_manager"
        >
          <LuUser2 size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Employees</p>
        </NavLink>
        <NavLink
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
          to="/userManager/products_manager"
        >
          <FiBox size={22} color="white" />
          <p style={{ color: "white", margin: 0, fontSize: 20 }}>Products</p>
        </NavLink>
      </div>
    </>
  );
}
