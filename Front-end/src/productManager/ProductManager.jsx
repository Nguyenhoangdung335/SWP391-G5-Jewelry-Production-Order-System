import React, { useState, useEffect } from "react"; 
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaBox } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

export default function ProductManager() {
    const { account } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [data, setData] = useState([]);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${ServerUrl}/api/products?size=100`,
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                setData(res.data.responseList.products);
            })
            .catch((err) => console.log(err));
    }, [currentPage]);

    const handleEdit = (record) => {
        setSelectedProduct(record);
        setIsModalVisible(true);
    };

    const handleDeleteClick = (record) => {
        setDeleteProduct(record);
        setIsDeleteModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const handleConfirmDelete = () => {
        const productId = deleteProduct.id;
        axios({
            method: "DELETE",
            url: `${ServerUrl}/api/products/${productId}`,
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                console.log(res);
                setIsDeleteModalVisible(false);
                setDeleteProduct(null);
    
                // Remove the deleted product from data
                const updatedData = data.filter((product) => product.id !== productId);
                setData(updatedData);
            })
            .catch((err) => {
                console.error("Error deleting product:", err);
            });
    };
    

    const handleAddCancel = () => {
        setIsCreateModalVisible(false);
    };

    const handleSave = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const values = {
            id: form.formProductId.value,
            name: form.formProductName.value,
            description: form.formProductDescription.value,
        };
        const newData = data.map((item) =>
            item.id === values.id ? values : item
        );
        setData(newData);
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const handleAdd = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const newProduct = {
            id: form.formProductId.value,
            name: form.formProductName.value,
            description: form.formProductDescription.value,
        };

        // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
        if (!newProduct.id || !newProduct.name || !newProduct.description) {
            alert("Please fill in all fields");
            return;
        }

        // Gửi yêu cầu POST tới back-end
        axios({
            method: "POST",
            url: `${ServerUrl}/api/products`,
            headers: { "Content-Type": "application/json" },
            data: newProduct,
        })
        .then((res) => {
            // Thêm sản phẩm mới vào trạng thái data nếu thành công
            setData([...data, res.data]);
            setIsCreateModalVisible(false);
        })
        .catch((err) => {
            console.error("Error creating product:", err);
            alert("There was an error creating the product. Please try again.");
        });
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setDeleteProduct(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const styles = {
        paginationContainer: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "20px",
        },
        paginationButton: {
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 5px",
            border: "1px solid #ddd",
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
        },
        paginationButtonActive: {
            backgroundColor: "#6c757d",
            color: "#fff",
        },
        paginationButtonDisabled: {
            backgroundColor: "#e9ecef",
            color: "#6c757d",
            cursor: "not-allowed",
        },
    };

    return (
        <div style={{ padding: "3%" }}>
            <style jsx>{`
                .new-product-button {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                    background-color: #6c757d;
                    border: none;
                    color: #e0d7ea;
                    padding: 8px 16px;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                .new-product-button:hover {
                    background-color: #007bff;
                }
            `}</style>
            <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
                Welcome, K!
            </p>
            <p style={{ fontSize: 16 }}>Products Manager</p>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                }}
            >
                <div></div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <div
                        onClick={() => setIsCreateModalVisible(true)}
                        className="new-product-button"
                    >
                        <FiPlus color="rgba(224, 215, 234, 1)" />
                        <p style={{ margin: 0, fontSize: 20, color: "white" }}>
                            New Product
                        </p>
                    </div>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <Button
                                        variant="link"
                                        onClick={() =>
                                            handleDeleteClick(product)
                                        }
                                    >
                                       <FaTrash />
                                    </Button>
                                    <span>|</span>
                                    <Button
                                        variant="link"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <FaEdit />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div style={styles.paginationContainer}>
                <div
                    style={{
                        ...styles.paginationButton,
                        ...(currentPage === 1
                            ? styles.paginationButtonDisabled
                            : {}),
                    }}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &lt;
                </div>
                {[...Array(totalPages).keys()].map((page) => (
                    <div
                        key={page + 1}
                        style={{
                            ...styles.paginationButton,
                            ...(page + 1 === currentPage
                                ? styles.paginationButtonActive
                                : {}),
                        }}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </div>
                ))}
                <div
                    style={{
                        ...styles.paginationButton,
                        ...(currentPage === totalPages
                            ? styles.paginationButtonDisabled
                            : {}),
                    }}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;
                </div>
            </div>
            <Modal show={isModalVisible} onHide={handleCancel}>
                <Modal.Header>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <Form onSubmit={handleSave}>
                            <Form.Group controlId="formProductId">
                                <Form.Label>ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedProduct.id}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="formProductName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedProduct.name}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProductDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedProduct.description}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" style={{marginTop: 20}}>
                                Save changes
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                style={{ marginLeft: 15,marginTop: 20 }}
                            >
                                Back
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={isDeleteModalVisible} onHide={handleCancelDelete}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this product?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={isCreateModalVisible} onHide={handleAddCancel}>
                <Modal.Header>
                    <Modal.Title>Create Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-5xl mb-5">
                        <FaBox />{" "}
                        <span className="text-4xl ml-3 font-medium">
                            Product
                        </span>
                    </div>
                    <Form onSubmit={handleAdd}>
                        <Form.Group controlId="formProductId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Button
                            style={{
                                backgroundColor: "#000000",
                                color: "white",
                            }}
                            type="submit"
                        >
                            Save changes
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleAddCancel}
                            style={{ marginLeft: 8 }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleAddCancel}
                            style={{ marginLeft: 8 }}
                        >
                            Create Your Dream Jewelry
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
