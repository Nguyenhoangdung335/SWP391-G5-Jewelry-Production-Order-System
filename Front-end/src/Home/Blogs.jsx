import React from "react";
import BlogMain from "../reusable/BlogMain";
import becomeTeacherImage from "../assets/becomeTeacher.jpg";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function Blogs() {
  return (
    <div className="d-flex flex-column w-full" style={{ overflowX: "hidden" }}>
      <div
        style={{ backgroundColor: "#4B4B4B", height: "20em" }}
        className="d-flex align-items-center justify-content-center w-full h-20"
      >
        <p style={{ fontSize: 30 }} className="text-white fw-bold">
          Custom Jewelry Blog
        </p>
      </div>
      <div
        style={{ boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
        className="w-100 d-flex gap-5 align-items-center px-5 py-4"
      >
        <p style={{ fontSize: 20 }} className="fw-bold">
          CATEGORIES
        </p>
        <p style={{ fontSize: 20 }} className="fw-bold">
          LATEST POSTS
        </p>
        <p style={{ fontSize: 20 }} className="fw-bold">
          ARCHIVES
        </p>
      </div>

      <div className="row">
        <div className="col-9">
          <BlogMain
            title="The Art of Custom Jewelry Process: A Step-by-Step Guide"
            time="31 May 2024 Uncategorized"
            subTime="Custom Jewelry.Fashion.jewelry tips"
            content="Learn how to clean your jewelry at home"
            image={becomeTeacherImage}
          />
          <BlogMain
            title="How to Clean Your Jewelry at Home"
            time="9 May 2024"
            subTime="Custom Jewelry.Fashion.jewelry tips"
            content="Learn how to clean your jewelry at home"
            image={becomeTeacherImage}
          />
          <div
            style={{
              padding: "3% 10%",
              marginBottom: "5%",
            }}
          >
            <button
              style={{
                backgroundColor: "rgba(75, 75, 75, 1)",
                borderRadius: 30,
                color: "white",
                padding: "2% 3%",
                fontSize: 20,
                boxShadow: "none",
                border: "none",
              }}
            >
              OLDER POSTS
            </button>
          </div>
        </div>
        <div className="col-3">
          <div
            style={{
              margin: "9% 0%",
              padding: "10% 0",
              borderTop: "1px solid rgba(57, 57, 57, 0.41)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              RECENT POST
            </p>
            <Link
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "black",
              }}
              to="/"
            >
              How to Clean Your Jewelry at Home
            </Link>
            <Link
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "black",
              }}
              to="/"
            >
              Celebrating Dad: Father’s Day Gift Ideas
            </Link>
          </div>
          <div
            style={{
              margin: "9% 0%",
              padding: "10% 0",
              borderTop: "1px solid rgba(57, 57, 57, 0.41)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              ARCHIVES
            </p>
            <Link style={{ fontSize: 18, color: "black" }} to="/">
              May 2024
            </Link>
            <Link style={{ fontSize: 18, color: "black" }} to="/">
              April 2024
            </Link>
            <Link style={{ fontSize: 18, color: "black" }} to="/">
              March 2024
            </Link>
          </div>
          <div
            style={{
              margin: "9% 0%",
              padding: "10% 0",
              borderTop: "1px solid rgba(57, 57, 57, 0.41)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              CATEGORIES
            </p>
            <Link
              style={{ fontSize: 18, color: "black" }}
              className="text-decoration-none"
              to="/"
            >
              Custom Jewelry
            </Link>
            <Link
              style={{ fontSize: 18, color: "black" }}
              className="text-decoration-none"
              to="/"
            >
              Diamonds
            </Link>
            <Link
              style={{ fontSize: 18, color: "black" }}
              className="text-decoration-none"
              to="/"
            >
              Engagement Ring
            </Link>
          </div>
          <div
            style={{
              margin: "9% 0%",
              padding: "10% 0",
              borderTop: "1px solid rgba(57, 57, 57, 0.41)",
              borderBottom: "1px solid rgba(57, 57, 57, 0.41)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              META
            </p>
            <Link
              style={{ fontSize: 18, color: "black" }}
              className="text-decoration-none"
              to="/"
            >
              Log in
            </Link>
            <Link
              style={{ fontSize: 18, color: "black" }}
              className="text-decoration-none"
              to="/"
            >
              Entries feed
            </Link>
            <Link
              style={{ fontSize: 18, color: "black" }}
              className="text-decoration-none"
              to="/"
            >
              WordPress.org
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
