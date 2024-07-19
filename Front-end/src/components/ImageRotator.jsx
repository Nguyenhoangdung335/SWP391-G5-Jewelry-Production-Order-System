import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Snowfall from "../assets/snowfall.jpg";
import "./ImageRotatorCSS.css";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function ImageRotator() {
  return (
    <Carousel
      responsive={responsive}
      centerMode={false}
      draggable={false}
      swipeable={false}
      infinite={true}
      pauseOnHover
      autoPlaySpeed={3000}
      autoPlay={true}
      containerClass="carousel-container"
    >
      <div className="card m-2">
        <img className="product--image" src={Snowfall} alt="product " />
      </div>
      <div className="card m-2 ">
        <img className="product--image" src={Snowfall} alt="product " />
      </div>
      <div className="card m-2 ">
        <img className="product--image" src={Snowfall} alt="product " />
      </div>
      <div className="card m-2">
        <img className="product--image" src={Snowfall} alt="product " />
      </div>
      <div className="card m-2 ">
        <img className="product--image" src={Snowfall} alt="product " />
      </div>
    </Carousel>
  );
}
