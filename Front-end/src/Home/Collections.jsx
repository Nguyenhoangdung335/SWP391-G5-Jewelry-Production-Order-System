import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import Pin from "../components/Pin";
import CreateRequest from "../orderFlows/CreateRequest";
import {Container, Modal, Button} from "react-bootstrap";
import "./Collections.css";
import noImage from "../assets/no_image.jpg";
import ServerUrl from "../reusable/ServerUrl";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../provider/AuthProvider";
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";
import { useAlert } from "../provider/AlertProvider";
import Loader from "./../reusable/Loader";

const size = ["small", "medium", "large"];
const pageSize = 10;

const getImageSize = (idSeed) => {
    const seed = hashStringToNumber(idSeed);
    const randomValue = seededRandom(seed);
    const getIndex = Math.floor(randomValue * size.length);
    return size[getIndex];
  };

function Collections() {
    const {token} = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);
    const { showAlert } = useAlert();
    const [products, setProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentProductRoughPrice, setCurrentProductRoughPrice] = useState(0);
    const loader = useRef(null);
    const isFetching = useRef(false);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
        }
    }, [token]);

    useEffect(() => {
        if (!isFetching.current && page <= totalPages) {
            isFetching.current = true;
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(
                        `${ServerUrl}/api/products?page=${page}&size=${pageSize}&isFinished=true`
                    );
                    if (response.status === 200) {
                        setPage(page + 1);
                        const newProducts = response.data.responseList.products;

                        // Avoid adding duplicate products
                        setProducts((prevProducts) => {
                            const existingIds = new Set(prevProducts.map(p => p.id));
                            const filteredNewProducts = newProducts.filter(p => !existingIds.has(p.id));
                            return [...prevProducts, ...filteredNewProducts];
                        });

                        setTotalPages(response.data.responseList.totalPages);
                        isFetching.current = false;
                    }
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };
            fetchProducts();
        }
    }, [page]);

    useEffect(() => {
        if (selectedProduct) {
            axios
                .get(
                    `${ServerUrl}/api/products/customize/calculate-price/${selectedProduct.specification.id}`
                )
                .then((res) => setCurrentProductRoughPrice(res.data))
                .catch((error) => console.log(error));
        }
    }, [selectedProduct]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && page < totalPages) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [page, totalPages]);

    if (!products || products.length === 0) {
        return (
            <Loader size="xl"/>
        );
    }

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

    const formatPrice = (price) => {
        return price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const checkCurrentOrder = () => {
        if (decodedToken === null) {
            showAlert(
                "Access Denied",
                "You must login to use this feature",
                "danger");
        } else if (decodedToken.role !== "CUSTOMER") {
            showAlert("Access Denied",
                "You don't have permission to use this feature",
                "danger");
        } else {
            axios
                .get(`${ServerUrl}/api/account/${decodedToken.id}/check-current-order`)
                .then((response) => {
                    if (response.data) {
                        showAlert("Ongoing Order",
                            "You already have an ongoing order. Please complete it before designing new jewelry.",
                            "warning");
                    } else {
                        setShowProductModal(false);
                        setShowCreateRequestModal(true);
                    }
                })
                .catch((error) => {
                    console.error("Error checking current order:", error);
                    showAlert("Error",
                        "Error checking current order. Please try again later.",
                        "danger");
                });
        }
    };

    const handleUseTemplate = () => {
        checkCurrentOrder();
    };

    return (
        <Container style={{ paddingTop: "10px" }}>
            <div className="view" style={styles.pin_container}>
                {products.map((product) => (
                    <Pin
                        key={product.id}
                        imageSource={product.imageURL || noImage}
                        size={getImageSize(product.id)}
                        onClick={() => handlePinClick(product)}
                    />
                ))}
                <div ref={loader} style={{ height: "50px" }} />
            </div>

            {selectedProduct && (
                <Modal
                    show={showProductModal}
                    onHide={handleCloseProductModal}
                    size="lg"
                    scrollable
                >
                    <Modal.Header className="w-100" closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={styles.modalContent}>
                            <div style={styles.imageContainer}>
                                <img
                                    src={selectedProduct.imageURL || noImage}
                                    alt={selectedProduct.name}
                                    style={{ width: "100%" }}
                                />
                                <h5 style={{ marginBlock: "5%", textAlign: "center" }}>
                                    {selectedProduct.description}
                                </h5>
                                <h5 style={{ marginTop: "5%", textAlign: "center" }}>
                                    Approximate price:
                                </h5>
                                <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
                                    {formatPrice(currentProductRoughPrice || 0)}
                                </p>
                            </div>
                            <div style={styles.detailsContainer}>
                                <ProductSpecificationTable selectedProduct={selectedProduct} />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="w-100 d-flex justify-content-center">
                        <Button onClick={handleUseTemplate}>Use this template</Button>
                    </Modal.Footer>
                </Modal>
            )}
            {showCreateRequestModal && (
                <Modal
                    show={showCreateRequestModal}
                    onHide={handleCloseCreateRequestModal}
                    size="lg"
                    backdrop="static"
                >
                    <Modal.Header style={{ width: "100%"}} closeButton>
                        <Modal.Title className="d-flex justify-content-center">Create Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ width: "100%", height: "70%" }}>
                        <CreateRequest productSpecId={selectedProduct.specification.id} onClose={handleCloseCreateRequestModal} isFromTemplate={true} />
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
        gap: "15px",
        flexDirection: "row",
    },
    imageContainer: {
        flex: 1,
    },
    detailsContainer: {
        flex: 1,
    },
};

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function hashStringToNumber(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  

export default Collections;
