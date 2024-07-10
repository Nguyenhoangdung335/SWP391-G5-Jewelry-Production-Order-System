import React, { useEffect, useState } from "react";
import axios from "axios";
import Pin from "../components/Pin";
import CreateRequest from "../orderFlows/CreateRequest";
import { Container, Modal, Button, Table } from "react-bootstrap";
import "./Collections.css";
import snowfall from "../assets/snowfall.jpg";
import serverUrl from "../reusable/ServerUrl";
import ServerUrl from "../reusable/ServerUrl";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import {Navigate} from "react-router-dom";

const size = ["small", "medium", "large"];

const getImageSize = () => {
    const getIndex = Math.floor(Math.random() * size.length);
    return size[getIndex];
};

const formatString = (string) => {
    if (string !== null && string !== "") {
        return string.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    }
    return null;
};

function Collections() {
    const { token } = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);

    const [products, setProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
        }
    }, [token]);

    useEffect(() => {
        axios
            .get(serverUrl + "/api/product/get-product-list")
            .then((response) => {
                setProducts(response.data.responseList.productList);
            })
            .catch((error) => {
                console.error("There was an error fetching the product list!", error);
            });
    }, []);

    const handlePinClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleCloseProductModal = () => {
        setShowProductModal(false);
    };

    const handleCloseCreateRequestModal = () => {
        setShowCreateRequestModal(false);
    };

    const checkCurrentOrder = () => {
        if(decodedToken===null) {
            alert("You must login to use this feature");
            setNavigate(true);
        } else {
            axios
                .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
                .then((response) => {
                    if (response.data) {
                        alert(
                            "You already have an ongoing order. Please complete it before designing new jewelry."
                        );
                    } else {
                        setShowProductModal(false);
                        setShowCreateRequestModal(true);
                    }
                })
                .catch((error) => {
                    console.error("Error checking current order:", error);
                    alert("Error checking current order. Please try again later.");
                });
        }
    };

    const handleUseTemplate = () => {
        checkCurrentOrder()
    };

    if(navigate){
        return <Navigate to="/login" />;
    }

    return (
        <Container style={{ paddingTop: "10px" }}>
            <div className="view" style={styles.pin_container}>
                {products.map((product) => (
                    <Pin
                        key={product.id}
                        imageSource={product.imageURL || snowfall}
                        size={getImageSize()}
                        onClick={() => handlePinClick(product)}
                    />
                ))}
            </div>

            {selectedProduct && (
                <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={styles.modalContent}>
                            <div style={styles.imageContainer}>
                                <img
                                    src={selectedProduct.imageURL || snowfall}
                                    alt={selectedProduct.name}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div style={styles.detailsContainer}>
                                <h4>{selectedProduct.description}</h4>
                                <Table striped bordered hover>
                                    <tbody>
                                    {Object.entries(selectedProduct.specification).map(
                                        ([key, value]) =>
                                            key !== "id" && (
                                                <tr key={key}>
                                                    <td>{formatString(key)}</td>
                                                    <td>{formatString(value)}</td>
                                                </tr>
                                            )
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleUseTemplate}>Use this template</Button>
                    </Modal.Footer>
                </Modal>
            )}
            {showCreateRequestModal && (
                <Modal show={showCreateRequestModal} onHide={handleCloseCreateRequestModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Create Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateRequest productSpecId={selectedProduct.specification.id} />
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
}


const styles = {
    pin_container: {
        margin: 0,
        padding: 0,
        width: "80vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 300px)",
        gridAutoRows: "10px",
        justifyContent: "center",
    },
    modalContent: {
        display: "flex",
        flexDirection: "row",
    },
    imageContainer: {
        flex: 1,
        paddingRight: "20px",
    },
    detailsContainer: {
        flex: 1,
    },
};

export default Collections;
