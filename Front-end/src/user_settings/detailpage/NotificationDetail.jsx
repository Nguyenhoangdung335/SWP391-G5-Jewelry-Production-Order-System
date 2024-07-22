import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button,  Container, Row } from "react-bootstrap";
import ServerUrl from "../../reusable/ServerUrl";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../provider/AuthProvider";
import arrayToDate from "../../reusable/ArrayToDate";
import CustomAlert from "../../reusable/CustomAlert";

const NotificationDetail = () => {
  const [notification, setNotification] = useState(null);
  const { token } = useAuth();
  const { notificationId } = useParams();
  const navigation = useNavigate();
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    text: '',
    isShow: false,
    alertVariant: 'primary',
  });

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/api/notifications/${notificationId}`
        );
        if (response.status === 200) {
          const notificationData = response.data.responseList.notification;
          setNotification({
            title: notificationData.report.title,
            description: notificationData.report.description,
            createdDate: arrayToDate(notificationData.report.createdDate),
            option: notificationData.option,
            orderId: notificationData.order,
          });
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
        setAlertConfig({
          title: 'Error',
          text: 'Error fetching notification data.',
          isShow: true,
          alertVariant: 'danger',
        });
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
    const url = `${ServerUrl}/api/notifications/${notification.orderId}/${notificationId}/confirm?confirmed=${confirmedBool}`;

    try {
      const response = await axios.post(url);
      if (response.status === 200) {
        // Handle success, maybe show a message or update UI
        setNotification((prevNotification) => ({
          ...prevNotification,
          option: false,
        }));
        setAlertConfig({
          title: 'Success',
          text: 'Confirmation successful.',
          isShow: true,
          alertVariant: 'success',
        });
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "MANAGER")
          setTimeout(() => {
            navigation("/userManager/orders_manager/order_detail", {
              state: notification.orderId,
            });
          }, 2000)
      }
    } catch (error) {
      console.error("Error confirming notification:", error);
      setAlertConfig({
        title: 'Error',
        text: 'Error confirming notification.',
        isShow: true,
        alertVariant: 'danger',
      });
    }
  };

  return (
    <Container className="p-4">
      <CustomAlert
          title={alertConfig.title}
          text={alertConfig.text}
          isShow={alertConfig.isShow}
          onClose={() => setAlertConfig(prev => ({ ...prev, isShow: false }))}
          alertVariant={alertConfig.alertVariant}
      />
      <Row>
        <div style={{ paddingTop: "5%" }}>
          <div
            className="mb-3"
            style={{
              borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
              lineHeight: "10px",
            }}
          >
            <h2>{notification.title}</h2>
            <p>{notification.createdDate}</p>
          </div>
          <div>
            <p
              style={{
                paddingInline: "5%",
                maxWidth: "100%",
                fontSize: "1.5rem",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              {notification.description}
            </p>
          </div>
        </div>
      </Row>
      <Row
        className="d-flex align-items-center"
        style={{ marginInline: "25%" }}
      >
        {notification.option && (
          <Row className="mt-2">
            <div style={{ borderTop: "1px solid rgba(166, 166, 166, 0.5)" }}>
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
                  <Button className=" m-2" onClick={() => handleConfirm(true)}>
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default NotificationDetail;
