import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Pin from "../components/Pin";
import CreateRequest from "../orderFlows/CreateRequest";
import { Container, Modal, Button } from "react-bootstrap";
import "./Collections.css";
import snowfall from "../assets/snowfall.jpg";
import ServerUrl from "../reusable/ServerUrl";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";

const size = ["small", "medium", "large"];
const pageSize = 5;

const getImageSize = () => {
    const getIndex = Math.floor(Math.random() * size.length);
    return size[getIndex];
};

function Collections() {
    const { token } = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);

    const [products, setProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentProductRoughPrice, setCurrentProductRoughPrice] = useState(0);
    const loader = useRef(null);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
        }
    }, [token]);

    useEffect(() => {
        console.log("Fetching");
        const fetchProducts = async () => {
            try {
              const response = await axios.get(`${ServerUrl}/api/products?page=${page}&size=${pageSize}`);
              const newProducts = response.data.responseList.products;
              setProducts(prevProducts => [...prevProducts, ...newProducts]);
              setTotalPages(response.data.responseList.totalPages)
            } catch (error) {
              console.error('Error fetching products:', error);
            }
          };
      
          fetchProducts();
    }, [page]);

    useEffect(() => {
        if (selectedProduct) {
            axios.get(`${ServerUrl}/api/products/customize/calculate-price/${selectedProduct.specification.id}`)
            .then((res) => setCurrentProductRoughPrice(res.data) )
            .catch((error) => console.log(error));
        }
	}, [selectedProduct]);

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
            alert("You must login to use this feature");
        } else if (decodedToken.role !== "CUSTOMER") {
            alert("You dont have permission to use this feature");
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

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const entry = entries[0];
            if (entry.isIntersecting && page < totalPages) {
                setPage(prevPage => prevPage + 1);
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
                <div ref={loader} style={{ height: "50px" }} />
            </div>

            {selectedProduct && (
                <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg">
                    <Modal.Header className="w-100" closeButton>
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
                                <h5 style={{marginBlock: "5%", textAlign: "center"}}>{selectedProduct.description}</h5>
                                <h5 style={{marginTop: "5%", textAlign: "center"}}>Approximate price:</h5>
                                <p style={{textAlign: "center", fontSize: "1.1rem"}}>{formatPrice(currentProductRoughPrice || 0)}</p>
                            </div>
                            <div style={styles.detailsContainer}>
                                <ProductSpecificationTable selectedProduct ={selectedProduct} />
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
                    <Modal.Header>
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

export default Collections;
