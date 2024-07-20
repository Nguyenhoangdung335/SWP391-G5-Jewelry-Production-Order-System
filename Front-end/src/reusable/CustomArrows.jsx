import React from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

// Custom left arrow component
const CustomLeftArrow = ({ onClick }) => (
    <div className="custom-arrow left" onClick={onClick}>
        <div className="square-wrap">
            <MdOutlineKeyboardArrowLeft size={30} />
        </div>
    </div>
);

// Custom right arrow component
const CustomRightArrow = ({ onClick }) => (
    <div className="custom-arrow right" onClick={onClick}>
        <div className="square-wrap">
            <MdOutlineKeyboardArrowRight size={30} />
        </div>
    </div>
);

export { CustomLeftArrow, CustomRightArrow };