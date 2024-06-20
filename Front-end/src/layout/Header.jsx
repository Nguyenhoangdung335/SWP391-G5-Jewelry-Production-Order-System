import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchCircle } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { Button } from "react-bootstrap";
import { Dropdown } from "antd";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";

export default function Header() {
  const [role, setRole] = useState("GUEST");
  const { token, setToken } = useAuth();

useEffect(() => {
  if (token) {
    const decodedToken = jwtDecode(token);
    setRole(decodedToken.role);
  }else{
    setRole("GUEST")
  }
}, [token])

  

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const items = [
    {
      key: "1",
      label: (
        <Link to="/" style={{ textDecoration: "none" }}>
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/" style={{ textDecoration: "none" }}>
          Setting
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link
          to="/login"
          style={{ textDecoration: "none" }}
          onClick={handleLogout}
        >
          Sign out
        </Link>
      ),
    },
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
      className="w-100 d-flex justify-content-between align-items-center px-5 py-2 h-20"
    >
      <Link to="/" className="text-decoration-none">
        <h1
          className="display-4 px-5"
          style={{ fontSize: "2rem", color: "black" }}
        >
          宝石店
        </h1>
      </Link>
      <div className="d-flex flex-column justify-content-center gap-2">
        <div className="position-relative w-100">
          <IoSearchCircle
            size={30}
            className="position-absolute top-50 translate-middle"
            style={{ right: "-2%" }}
          />
          <input
            className="w-100 py-1 border-1"
            style={{
              borderRadius: 30,
              backgroundColor: "rgba(255, 251, 251, 1)",
            }}
            type="text"
          />
        </div>
        <div className="d-flex flex-row justify-content-center gap-5 ">
          <Link className="text-decoration-none text-dark" to="/">
            Home
          </Link>
          <Link
            className="text-decoration-none text-dark"
            to="/collections_page"
          >
            Collections
          </Link>
          <Link className="text-decoration-none text-dark" to="/blogs_page">
            Blogs
          </Link>
          <Link
            className="text-decoration-none text-dark"
            to="/live_price_page"
          >
            Live Price
          </Link>
          <Link className="text-decoration-none text-dark" to="/about_page">
            About
          </Link>
        </div>
      </div>
      <div className="d-flex flex-row align-items-center gap-3">
        {role !== "GUEST" && (
          <>
            <IoNotificationsOutline size={30} color="black" />
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomLeft"
            >
              <GoPerson size={30} color="black" />
            </Dropdown>
          </>
        )}
        {role === "GUEST" && (
          <Link
            to="/login"
            className="text-decoration-none fw-bolder text-dark"
          >
            Sign in
          </Link>
        )}
        <Link to="/order_page">
          <Button
            style={{ borderRadius: 25, backgroundColor: "#4B4B4B" }}
            variant="outline-light"
            className="shadow px-4 py-2 fw-bolder"
          >
            Make jewelry
          </Button>
        </Link>
      </div>
    </div>
  );
}
