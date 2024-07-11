import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    axios
      .get(`${ServerUrl}/api/notification/${decodedToken.id}/get-all`)
      .then((response) => {
        if (response.data.status === "OK") {
          setNotifications(response.data.responseList.notificationList);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <div
            className="p-3 m-3 text-black"
            style={{ border: "1px solid black", borderRadius:"16px" }}
            key={notification.id}
          >
            <h4>{notification.report.title}</h4>
            <p>{notification.report.description}</p>
            <p>{notification.report.createdDate}</p>
          </div>
        </Link>
      ))}
    </Container>
  );
};

export default NotificationPage;
