import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import ServerUrl from "../../reusable/ServerUrl";

const NotificationDetail = () => {
  const [notification, setNotification] = useState(null);
  const { notificationId } = useParams();

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

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/api/notification/get/${notificationId.toUpperCase()}`
        );
        if (response.status === 200) {
          const notificationData = response.data.responseList.notification;
          setNotification({
            title: notificationData.report.title,
            description: notificationData.report.description,
            createdDate: arrayToDate(notificationData.report.createdDate),
            option: notificationData.option,
            orderId: notificationData.order.id,
          });
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    fetchNotification();
  }, [notificationId]);

  if (!notification) {
    return <div>Loading...</div>;
  }

  const handleConfirm = async (confirmed) => {
    console.log(confirmed);
    const confirmedBool = Boolean(confirmed);
    const url = `${ServerUrl}/api/notification/${notification.orderId}/confirm?confirmed=${confirmedBool}`;

    try {
      const response = await axios.post(url);
      if (response.status === 200) {
        // Handle success, maybe show a message or update UI
        alert("Confirmation successful");
      }
    } catch (error) {
      console.error("Error confirming notification:", error);
    }
  };

  return (
    <Container className="p-4 m-4">
      <Row>
        <div
          className="p-4"
          style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}
        >
          <div className="pb-2">
            <h3>{notification.title}</h3>
            <p>{notification.createdDate}</p>
          </div>
          <div>
            <p>{notification.description}</p>
          </div>
        </div>
      </Row>
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          {notification.option && (
            <Row className="mt-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div className="mb-2">
                    <h4 className="text-center">Actions</h4>
                  </div>
                  <div className="d-flex justify-content-around">
                    <Button
                      variant="danger"
                      onClick={() => handleConfirm(false)}
                      className=" m-2"
                    >
                      Decline
                    </Button>
                    <Button
                      className=" m-2"
                      onClick={() => handleConfirm(true)}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </Row>
          )}
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
};

export default NotificationDetail;
