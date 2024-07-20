import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ImageRotatorCSS.css";
import {CustomLeftArrow, CustomRightArrow} from "../reusable/CustomArrows";
import ServerUrl from "../reusable/ServerUrl";
import axios from "axios";
import {useEffect, useState} from "react";

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

const ImageRotator = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${ServerUrl}/api/products/latest_product`)
        .then(response => {
          if (response.data.status === "OK" && response.data.statusCode === 200) {
            setProducts(response.data.responseList.products);
          }
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
  }, []);

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
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
      >
        {products.map(product => (
            <div key={product.id} className="card m-2">
              <img className="product--image" src={product.imageURL} alt={product.name} />
            </div>
        ))}
      </Carousel>
  );
}

export default ImageRotator;
