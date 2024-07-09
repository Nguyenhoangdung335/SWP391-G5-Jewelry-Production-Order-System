import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { Dropdown, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

export default function HeaderManager() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Duy vua gui ban 1 tin nhan", time: "49 minute", read: false },
    { id: 2, message: "Khai vua nhan 1 order", time: "1 hour", read: false },
    { id: 3, message: "di ca phe overnight", time: "3 hour", read: true },
    { id: 4, message: "send ", time: "1 day", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

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
          onClick={() => localStorage.removeItem("token")}
        >
          Logout
        </Link>
      ),
    },
  ];

  return (
    <div
      className="d-flex justify-content-between align-items-center px-5 py-2"
      style={{ height: "10%", backgroundColor: "rgb(75, 75, 75)" }}
    >
      <style>
        {`
          #dropdown-notifications::after {
            display: none !important;
          }
        `}
      </style>
      <div className="position-relative">
        <FiSearch
          size={20}
          className="position-absolute top-50 translate-middle"
          style={{ left: "10%" }}
        />
        <input
          className="w-100 py-1"
          style={{
            borderRadius: 10,
            backgroundColor: "rgba(255, 251, 251, 1)",
            paddingLeft: "2.5rem",
          }}
          type="text"
        />
      </div>
      <div className="d-flex flex-row align-items-center gap-2">
        <Dropdown>
          <Dropdown.Toggle
            variant="link"
            id="dropdown-notifications"
            style={{
              position: "relative",
              padding: 0,
              marginTop: '0.3rem',
              marginLeft: '-150px',
            }}
          >
            <div
              style={{
                position: "relative",
                width: "3rem",
                height: "3rem",
                backgroundColor: "gray",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GoPerson size={35} color="white" />
              {unreadCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  style={{
                    position: "absolute",
                    top: -5,
                    left: 24,
                    fontSize: '0.9rem',
                    padding: '0.1em 0.3em',
                  }}
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" style={{ width: "200px" }}>
            {items.map(item => (
              <Dropdown.Item key={item.key}>
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
