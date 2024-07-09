import React from "react";
import snowfall from "../assets/snowfall.jpg";

function Pin({ imageSource, size, onClick }) {
  return (
      <div className="block" style={{ ...styles.pin, ...styles[size] }} onClick={onClick}>
        <img
            src={imageSource || snowfall}
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
    borderRadius: "10px",
    backgroundColor: "red",
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