import React from "react";
import Carousel from "react-bootstrap/Carousel";
import VideoBanner from "../assets/2024-Icons-HP-Hero-HW-Video-Desktop-3.mp4";
import { Button } from "react-bootstrap";

function ControlledCarousel() {
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
            variant="outline-light fw-bold"
            style={{
              backgroundColor: "#707070",
              borderColor: "#707070",
              width: "150px",
              borderRadius: "22px",
              height: "40px",
            }}
          >
            Create Jewelry
          </Button>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
export default ControlledCarousel;
