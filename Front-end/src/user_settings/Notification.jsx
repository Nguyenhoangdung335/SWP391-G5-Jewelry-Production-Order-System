import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const HoverDiv = ({ children }) => {
  const [mouseEnter, setMouseEnter] = useState(false);

  const handleMouse = (e) => {
    setMouseEnter(e);
  };
  return (
    <div
      className="p-3 m-3 text-black shadow-sm"
      onMouseEnter={() => handleMouse(true)}
      onMouseLeave={() => handleMouse(false)}
      style={{
        border: "1px solid #c4c4c4",
        borderRadius: "20px",
        transform: mouseEnter ? "scale(1.01)" : "scale(0.98)",
        transition: "transform 200ms ease-out",
      }}
    >
      {children}
    </div>
  );
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mouseEnter, setMouseEnter] = useState(false);
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    axios
      .get(`${ServerUrl}/api/notifications/receiver/${decodedToken.id}`)
      .then((response) => {
        if (response.data.status === "OK") {
          setNotifications(response.data.responseList.notifications);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const arrayToDate = (dateArray) => {
    const dateObject = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    return dateObject.toLocaleString(); // Format the date as needed
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {notifications.map((notification) => (
        <Link
          to={`/user_setting_page/notification_page/${notification.id}`}
          style={{ textDecoration: "none" }}
        >
          <HoverDiv key={notification.id}>
            <h4>{notification.report.title}</h4>
            <p>{notification.report.description}</p>
            <p>{arrayToDate(notification.report.createdDate)}</p>
          </HoverDiv>
        </Link>
      ))}
    </Container>
  );
};

export default NotificationPage;
