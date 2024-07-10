import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import VideoBanner from "../assets/2024-Icons-HP-Hero-HW-Video-Desktop-3.mp4";
import {Button} from "react-bootstrap";
import {Link, Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

function ControlledCarousel() {
    const {token} = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
        }
    }, [token]);

    const checkCurrentOrder = () => {
        if (decodedToken === null) {
            alert("You must login to use this feature");
        } else if (decodedToken.role !== "CUSTOMER") {
            alert("You dont have permission to use this feature");
        } else {
            axios
                .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
                .then((response) => {
                    if (response.data) {
                        alert(
                            "You already have an ongoing order. Please complete it before designing new jewelry."
                        );
                    } else {
                        setRequestSent(true);
                    }
                })
                .catch((error) => {
                    console.error("Error checking current order:", error);
                    alert("Error checking current order. Please try again later.");
                });
        }

    };

    const handleClick = () => {
        checkCurrentOrder();
    }

    if (requestSent) {
        return <Navigate to="/order_page"/>;
    }

    return (
        <Carousel controls indicators={false} prevIcon={false} nextIcon={false}>
            <Carousel.Item>
                <video
                    width="100%"
                    height="100%"
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    preload="auto"
                    data-preload="true"
                    class="load-lazily b-loaded"
                    poster="//media.tiffany.com/is/image/tiffanydm/2024-Icons-HP-Hero-HW-Video-Desktop-2?$tile$&amp;&amp;hei=900"
                    src={VideoBanner}
                ></video>
                <Carousel.Caption className="mb-5">
                    <div className="carousel-introduction mb-3">
                        <h3>Welcome To 宝石店</h3>
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
    );
}

export default ControlledCarousel;
