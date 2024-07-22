import React from "react";
import noImage from "../assets/no_image.jpg";

function Pin({ imageSource, size, onClick }) {
  return (
      <div className="block" style={{ ...styles.pin, ...styles[size] }} onClick={onClick}>
        <img
            src={imageSource || noImage}
            alt="Product"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
  );
}

const styles = {
  pin: {
    margin: "15px 10px",
    padding: 0,
    backgroundColor: "white",
    cursor: "pointer", // Added cursor to indicate clickable
  },
  small: {
    gridRowEnd: "span 26",
  },
  medium: {
    gridRowEnd: "span 33",
  },
  large: {
    gridRowEnd: "span 45",
  },
};

export default Pin;