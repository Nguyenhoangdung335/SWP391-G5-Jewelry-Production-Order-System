import React from "react";
import Carousel from "react-bootstrap/Carousel";
import LuxuryBanner1 from "../assets/luxury-banner1.jpg";
import LuxuryBanner2 from "../assets/luxury-banner2.jpg";
import NecklaceBanner from "../assets/necklace-banner.jpg";
import { Container } from "react-bootstrap";

function ControlledCarousel() {
  const [index, setIndex] = React.useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        indicators={true}
        fade
      >
        <Carousel.Item>
          <img
            src={LuxuryBanner1}
            alt="luxury-banner-1"
            className="d-block w-100"
            style={{ objectFit: "cover", height: "87vh" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={LuxuryBanner2}
            alt="luxury-banner-2"
            className="d-block w-100"
            style={{ objectFit: "cover", height: "87vh" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={NecklaceBanner}
            alt="necklace-banner"
            className="d-block w-100"
            style={{ objectFit: "cover", height: "87vh" }}
          />
        </Carousel.Item>
      </Carousel>
    
  );
}
export default ControlledCarousel;
