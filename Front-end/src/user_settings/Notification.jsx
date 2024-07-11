import React, {useEffect, useState} from "react";
import {useAuth} from "../provider/AuthProvider";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const {token} = useAuth();
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
        <div>
            {notifications.map(notification => (
                <div key={notification.id}>
                    <Link to={`/user_setting_page/notification_page/${notification.id}`} style={{ textDecoration: 'none' }}>
                        <h4>{notification.report.title}</h4>
                        <p>{notification.report.description}</p>
                        <p>{notification.report.createdDate}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NotificationPage;