import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import GemStoneBanner from "../assets/Gemstone.mp4";
import Loader from "../reusable/Loader";
import {useAlert} from "../provider/AlertProvider";

function ControlledCarousel() {
  const {token} = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

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
      showAlert(
          "Access Denied",
          "You must login to use this feature",
          "danger"
      );
      setTimeout(() => {
        navigate("/login");
      }, 500)
    } else if (decodedToken.role !== "CUSTOMER") {
      showAlert(
          "Access Denied",
          "You don't have permission to use this feature",
          "danger"
      );
    } else {
      axios
        .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
        .then((response) => {
          if (response.data) {
            showAlert(
                "Ongoing Order",
                "You already have permission to use this feature. Please complete it before designing new jewelry.",
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
    </>
  );
}

export default ControlledCarousel;
