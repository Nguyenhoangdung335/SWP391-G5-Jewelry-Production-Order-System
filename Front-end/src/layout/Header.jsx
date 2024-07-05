import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoChatbubbleOutline, IoSearchCircle } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import {
  Badge,
  Button,
  Container,
  Nav,
  NavLink,
  Navbar,
} from "react-bootstrap";
import { Dropdown } from "antd";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";

export default function Header() {
  const [role, setRole] = useState("GUEST");
  const [state, setState] = useState(false);
  const { token, setToken } = useAuth();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
    } else {
      setRole("GUEST");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const items = [
    {
      key: "1",
      label: (
        <Link to="/user_setting_page" style={{ textDecoration: "none" }}>
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          to="/user_setting_page/order_history_page"
          style={{ textDecoration: "none" }}
        >
          Order History
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link
          to="/user_setting_page/notification_page"
          style={{ textDecoration: "none" }}
        >
          Notification
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link
          to="/login"
          style={{ textDecoration: "none" }}
          onClick={handleLogout}
        >
          Logout
        </Link>
      ),
    },
  ];

  const handleClick = () => {
    setState(true);
  };

  return (
    <Navbar
      bg="light"
      data-bs-theme="light"
      sticky="top"
      style={{ boxShadow: "0px 1px 4px" }}
    >
      <Container>
        <Navbar.Brand>
          <Link
            to="/"
            style={{
              color: "black",
              textDecoration: "none",
              position: "relative",
            }}
          >
            <h1 className="fw-bold">宝石店</h1>
          </Link>
        </Navbar.Brand>
        <Nav className=" me-auto">
          <Nav.Link>
            <Link to="/" className="nav-item nav-item-ltr">
              Home
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/collections_page" className="nav-item nav-item-ltr">
              Collections
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/blogs_page" className="nav-item nav-item-ltr">
              Blogs
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/live_price_page" className="nav-item nav-item-ltr">
              Gold Price
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/about_page" className="nav-item nav-item-ltr">
              About
            </Link>
          </Nav.Link>
        </Nav>
        <Nav className="gap-1">
          {role !== "GUEST" && token && (
            <>
              <NavLink>
                <Link to="/chat" style={{ textDecoration: "none" }}>
                  <IoChatbubbleOutline size={30} color="black" />
                </Link>
              </NavLink>
              <NavLink>
                <div>
                  <IoNotificationsOutline size={30} color="black" />
                  <Badge
                    style={{ fontSize: "8px", translate: "-15px -10px" }}
                    pill
                    bg="danger"
                  >
                    3
                  </Badge>
                </div>
              </NavLink>
              <NavLink>
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomLeft"
                >
                  <GoPerson size={30} color="black" />
                </Dropdown>
              </NavLink>
            </>
          )}
          {(role === "GUEST" || !token) && (
            <>
              <Nav.Link>
                <Link to="/login" className="nav-item">
                  Login
                </Link>
              </Nav.Link>
            </>
          )}
          <Link to="/order_page">
            <Button style={{ borderRadius: "22px", width: "150px" }}>
              Design Jewelry
            </Button>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
