import React, {useEffect, useState} from "react";
import {useAuth} from "../provider/AuthProvider";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import arrayToDate from "../reusable/ArrayToDate";

const HoverDiv = ({children}) => {
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
                transform: mouseEnter ? "scale(0.99)" : "scale(0.98)",
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
    const {token} = useAuth();
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

        return () => {

        };
    }, [decodedToken.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            {notifications.length === 0 ? (
                <Row className="d-flex justify-content-center align-items-center mt-5">
                    <Col xs="auto" className="text-center">
                        <h4>No notifications found</h4>
                    </Col>
                </Row>
            ) : (
                notifications.map((notification) => (
                    <Link
                        key={notification.id}
                        to={`${notification.id}`}
                        style={{textDecoration: "none"}}
                    >
                        <HoverDiv>
                            <h4>{notification.report.title}</h4>
                            <p>{notification.report.description}</p>
                            <p>{arrayToDate(notification.report.createdDate)}</p>
                        </HoverDiv>
                    </Link>
                ))
            )}
        </Container>
    );
};

export default NotificationPage;
