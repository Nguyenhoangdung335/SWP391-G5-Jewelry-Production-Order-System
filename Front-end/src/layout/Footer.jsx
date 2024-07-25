import React, {useEffect, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {IoLogoFacebook} from "react-icons/io5";
import {FaInstagram} from "react-icons/fa";
import {FaYoutube} from "react-icons/fa";
import {Container, Row, Col, Button} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import {useAlert} from "../provider/AlertProvider";

export default function Footer() {
    const {token} = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();


    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
        } else {
            setDecodedToken(null);
        }
    }, [token]);

    const checkCurrentOrder = () => {
        if (decodedToken === null) {
            showAlert(
                "Access Denied",
                "You must login to use this feature",
                "danger"
            );
            setTimeout(() => {
                navigate("/login");
            }, 500)
        } else if (decodedToken.role !== "CUSTOMER") {
            showAlert(
                "Access Denied",
                "You don't have permission to use this feature",
                "danger"
            );
        } else {
            axios
                .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
                .then((response) => {
                    if (response.data) {
                        showAlert(
                            "Ongoing Order",
                            "You already have an ongoing order. Please complete it before designing new jewelry.",
                            "warning"
                        );
                    } else {
                        navigate("/order_page");
                    }
                })
                .catch((error) => {
                    console.error("Error checking current order:", error);
                    showAlert(
                        "Error",
                        "Error checking current order. Please try again later.",
                        "danger"
                    );
                });
        }
    };

    const handleClick = () => {
        checkCurrentOrder();
    };

    return (
        <>
            <div
                className="pt-4 pb-4"
                style={{
                    backgroundColor: "#e5e5e5",
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
                                            <IoLogoFacebook size={30}/>
                                            <FaInstagram size={30}/>
                                            <FaYoutube size={30}/>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <Button
                                            style={{borderRadius: 25}}
                                            variant="outline-dark"
                                            className="border-2 shadow-sm px-4 py-2 "
                                            onClick={handleClick}
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
            <div className="pb-1 pt-3" style={{backgroundColor: "#4b4b4b"}}>
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
        </>
    );
}
