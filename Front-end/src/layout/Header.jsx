import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {IoChatbubbleOutline, IoNotificationsOutline} from "react-icons/io5";
import {GoPerson} from "react-icons/go";
import {
    Badge,
    Button,
    Container,
    Nav,
    NavLink,
    Navbar,
} from "react-bootstrap";
import {Dropdown, Menu} from "antd";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../provider/AuthProvider";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import logo_black from "../assets/logo_black.svg";
import {useAlert} from "../provider/AlertProvider";

export default function Header() {
    const [role, setRole] = useState("GUEST");
    const [firstName, setFirstName] = useState("");
    const {token, setToken} = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [rowsToShow, setRowsToShow] = useState(5);
    const navigate = useNavigate()
    const { showAlert } = useAlert();

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
            setFirstName(decodedToken.first_name);

            // Fetch notifications
            axios
                .get(
                    `${ServerUrl}/api/notifications/receiver/${decodedToken.id}/unread`
                )
                .then((response) => {
                    if (response.data.status === "OK") {
                        setNotifications(response.data.responseList.notifications);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching notifications:", error);
                });
        } else {
            setRole("GUEST");
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const checkCurrentOrder = () => {
        if (role === "GUEST") {
            showAlert(
                "Access Denied",
                "danger");
            setTimeout(() => {
                navigate("/login");
            }, 500)
        } else if (role !== "CUSTOMER") {
            showAlert(
                "Access Denied",
                "You don't have permission to use this feature",
                "danger"
            );
        } else {
            const decodedToken = jwtDecode(token);
            axios
                .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
                .then((response) => {
                    if (response.data) {
                        showAlert(
                            "Ongoing Order",
                            "You already have an ongoing order. Please complete it before designing new jewelry.",
                            "warning"
                        );
                    } else {
                        navigate("/order_page");
                    }
                })
                .catch((error) => {
                    console.error("Error checking current order:", error);
                    showAlert(
                        "Error",
                        "Error checking current order. Please try again later.",
                        "danger"
                    );
                });
        }
    };

    const items = [
        {
            key: "1",
            label: (
                <Link
                    to="/user_setting_page/profile_page"
                    style={{textDecoration: "none"}}
                >
                    Profile
                </Link>
            ),
        },
        role === "CUSTOMER" && {
            key: "2",
            label: (
                <Link
                    to="/user_setting_page/order_history_page"
                    style={{textDecoration: "none"}}
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
                    style={{textDecoration: "none"}}
                >
                    Notification
                </Link>
            ),
        },
        role !== "CUSTOMER" && {
            key: "4",
            label: (
                <Link to="/userManager" style={{textDecoration: "none"}}>
                    User Manager
                </Link>
            ),
        },
        {
            key: "5",
            label: (
                <Link
                    to="/login"
                    style={{textDecoration: "none"}}
                    onClick={handleLogout}
                >
                    Logout
                </Link>
            ),
        },
    ];

    const handleClick = () => {
        checkCurrentOrder();
    };

    const handleLoadMore = () => {
        setRowsToShow(rowsToShow + 5);
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const handleNotificationClick = (notificationId) => {
        navigate(`/user_setting_page/notification_page/${notificationId}`);
    };

    const notificationMenu = (
        <Menu>
            <Menu.Item key="header">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h6 style={{margin: 0, pointerEvents: "none"}}>Notifications</h6>
                    <Link to="/user_setting_page/notification_page">View All</Link>
                </div>
            </Menu.Item>
            {notifications.length === 0 ? (
                <Menu.Item key="no-notifications" disabled>
                    No unread notifications
                </Menu.Item>
            ) : (
                notifications
                    .sort(
                        (a, b) =>
                            new Date(b.report.createdDate) - new Date(a.report.createdDate)
                    )
                    .slice(0, rowsToShow)
                    .map((notification) => (
                        <Menu.Item
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                        >
                            <div>
                                <strong>{notification.report.title}</strong>
                                <p
                                    style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        maxWidth: "250px",
                                    }}
                                >
                                    {notification.report.description}
                                </p>
                            </div>
                        </Menu.Item>
                    ))
            )}
            {notifications.length > rowsToShow && (
                <Menu.Item key="load-more">
                    <Button onClick={handleLoadMore} style={{width: "100%"}}>
                        Load More
                    </Button>
                </Menu.Item>
            )}
        </Menu>
    );

  return (
    <>
      <Navbar
        bg="light"
        data-bs-theme="light"
        sticky="top"
        collapseOnSelect
        expand="md"
        className="shadow-sm"
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
              <div className="logo-container"><img src={logo_black} alt="logo_black" className="logo" /></div>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
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
            <Nav className="gap-1 align-items-center">
              {role !== "GUEST" && token && (
                <>
                  <NavLink>
                    <Link to="/chat" style={{ textDecoration: "none" }}>
                      <IoChatbubbleOutline size={30} color="black" />
                    </Link>
                  </NavLink>
                  <NavLink>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <Dropdown
                        overlay={notificationMenu}
                        placement="bottomRight"
                        trigger={["click"]}
                      >
                        <div
                          style={{ position: "relative", cursor: "pointer" }}
                        >
                          <IoNotificationsOutline size={30} color="black" />
                          {unreadCount > 0 && (
                            <span
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                padding: "0.25em 0.5em",
                                fontSize: "0.75em",
                                lineHeight: "1",
                                transform: "translate(50%, -50%)",
                              }}
                            >
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </Dropdown>
                    </div>
                  </NavLink>
                  <NavLink>
                    <Dropdown menu={{ items }} placement="bottomLeft">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <GoPerson size={30} color="black" />
                        <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
                          {firstName}
                        </span>
                        <Badge
                          pill
                          bg={
                            role === "ADMIN"
                              ? "danger"
                              : role === "MANAGER"
                              ? "warning"
                              : "primary"
                          }
                          className="ms-2"
                        >
                          {role}
                        </Badge>
                      </div>
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
              <Button
                style={{ borderRadius: "22px", width: "150px" }}
                onClick={handleClick}
              >
                Design Jewelry
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
