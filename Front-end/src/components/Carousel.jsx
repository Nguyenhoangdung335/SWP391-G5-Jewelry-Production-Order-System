import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import GemStoneBanner from "../assets/Gemstone.mp4";
import CustomAlert from "../reusable/CustomAlert";
import Loader from "../reusable/Loader";

function ControlledCarousel() {
  const {token} = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const navigate = useNavigate();
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    text: "",
    isShow: false,
    alertVariant: "primary",
  });
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
    }
  }, [token]);

  useEffect(() => {
    const video = document.querySelector("video");
    const handleLoadedData = () => setLoading(false);

    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  const checkCurrentOrder = () => {
    if (decodedToken === null) {
      setAlertConfig({
        title: "Access Denied",
        text: "You must login to use this feature",
        isShow: true,
        alertVariant: "danger",
      });
    } else if (decodedToken.role !== "CUSTOMER") {
      setAlertConfig({
        title: "Access Denied",
        text: "You don't have permission to use this feature",
        isShow: true,
        alertVariant: "danger",
      });
    } else {
      axios
        .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
        .then((response) => {
          if (response.data) {
            setAlertConfig({
              title: "Ongoing Order",
              text: "You already have an ongoing order. Please complete it before designing new jewelry.",
              isShow: true,
              alertVariant: "warning",
            });
          } else {
            navigate("/order_page");
          }
        })
        .catch((error) => {
          console.error("Error checking current order:", error);
          setAlertConfig({
            title: "Error",
            text: "Error checking current order. Please try again later.",
            isShow: true,
            alertVariant: "danger",
          });
        });
    }
  };

  const handleClick = () => {
    checkCurrentOrder();
  };

  return (
    <>
      {loading && <Loader />} {/* Render Loader while loading */}
      <Carousel controls indicators={false} prevIcon={false} nextIcon={false}>
        <Carousel.Item
          style={{ height: "87vh", width: "100%", objectFit: "cover" }}
        >
          <video
            width="100%"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            data-preload="true"
            className="load-lazily b-loaded"
            src={GemStoneBanner}
          />
          <Carousel.Caption className="mb-5">
            <div className="carousel-introduction mb-3">
              <h3>Welcome To CaraJewelry</h3>
              <h6>Where To Make Your Dream Jewelry</h6>
            </div>
            <Button
              style={{
                width: "150px",
                borderRadius: "22px",
                height: "40px",
              }}
              onClick={handleClick}
            >
              Create Jewelry
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <CustomAlert
        title={alertConfig.title}
        text={alertConfig.text}
        isShow={alertConfig.isShow}
        onClose={() => setAlertConfig({ ...alertConfig, isShow: false })}
        alertVariant={alertConfig.alertVariant}
      />
    </>
  );
}

export default ControlledCarousel;
