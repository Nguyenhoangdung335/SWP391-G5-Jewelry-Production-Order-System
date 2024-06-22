import React from "react";
import { Link } from "react-router-dom";
import { IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function Footer() {
  return (
    <div className="pt-4">
      <div
        className="pt-4 pb-4"
        style={{
          backgroundColor: "#e5e5e5",
          // borderTop: "2px solid black",
          borderRight: "",
        }}
      >
        <Container>
          <Row className="mb-4">
            <Col md={6}>
              <Row>
                <Col md={6} className="mb-4">
                  <div className="d-flex flex-column gap-2">
                    <p className="font-weight-bold h4">Jewelry Shop</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-4">
                  <div className="d-flex flex-column gap-2">
                    <p className=" font-weight-bold h4">Quick Link</p>
                    <div className="d-flex flex-column">
                      <Link
                        className=" mb-1 text-black text-decoration-none "
                        to="/"
                      >
                        Home
                      </Link>
                      <Link
                        className=" mb-1 text-black text-decoration-none"
                        to="/collections_page"
                      >
                        Collections
                      </Link>
                      <Link
                        className=" mb-1 text-black text-decoration-none"
                        to="blogs_page"
                      >
                        Blogs
                      </Link>
                      <Link
                        className=" mb-1 text-black text-decoration-none"
                        to="/live_price_page"
                      >
                        LivePrice
                      </Link>
                      <Link
                        className=" mb-1 text-black text-decoration-none"
                        to="/about_page"
                      >
                        About
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col
                  md={12}
                  className="d-flex flex-column flex-md-row justify-content-between align-items-center"
                >
                  <Col md={6} className="d-flex flex-column mb-4 mb-md-0">
                    <p className=" font-weight-bold h4">Social Media</p>
                    <div className="d-flex gap-3">
                      <IoLogoFacebook size={30} />
                      <FaInstagram size={30} />
                      <FaYoutube size={30} />
                    </div>
                  </Col>
                  <Col md={12}>
                    <Button
                      style={{ borderRadius: 25 }}
                      variant="outline-dark"
                      className="border-2 shadow-sm px-4 py-2 "
                    >
                      Make your own jewelry
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={6} className="mb-4">
                  <div className="d-flex flex-column gap-2">
                    <p className=" font-weight-bold h4">Contact us</p>
                    <div className="d-flex flex-column">
                      <p>Phone: 607-647-4949</p>
                      <p>Gmail: placeholder@gmail.com</p>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-4">
                  <div className="d-flex flex-column gap-2">
                    <p className=" font-weight-bold h4">Address</p>
                    <div>
                      <p>1771 Frosty Lane,</p>
                      <p>Mcdonugh, </p>
                      <p>New York 13801</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="pb-1 pt-3" style={{ backgroundColor: "#4b4b4b" }}>
        <Container>
          <Row className="text-white">
            <Col className="text-left">
              <p className="mb-0">&copy; jewelryshop.com 2024.</p>
            </Col>
            <Col className="d-flex justify-content-end gap-4">
              <p>Privacy Policy</p>
              <p>Return Policy</p>
              <p>Terms and service</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
