import React from "react";
import { Link } from "react-router-dom";

export default function BlogMain({ title, time, subTime, content, image }) {
  return (
    <div
      style={{
        padding: "3% 10%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom:'2%'
      }}
      className="gap-4"
    >
      {image && (
        <img
          src={image}
          alt="Blog"
          style={{ width: "70%", height: "360px", objectFit:"cover" }}
        />
      )}
      <Link
        to="/"
        style={{ color: "rgba(0, 0, 0, 0.4)", fontSize: 24 }}
        className="d-flex flex-row justify-content-center"
      >
        <p>{time}</p>
        <p>{subTime}</p>
      </Link>
      <p style={{ fontSize: 30, fontWeight: 700 }}>{title}</p>
      <p style={{ color: "rgb(0, 0, 0, 0.5)", fontSize: 30 }}>{content}</p>
      <Link style={{ fontSize: 30, color: "black" }}>READ MORE</Link>
    </div>
  );
}
