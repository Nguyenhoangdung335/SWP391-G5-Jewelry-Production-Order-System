import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaBox } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";
import { useAlert } from "../provider/AlertProvider";
import EditProductModal from "./EditProductModal";
import { jwtDecode } from "jwt-decode";

export default function ProductManager() {
  const { showAlert } = useAlert();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showEditing, setShowEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);
  // const [isLoading, setIsLoading] = useState(true);

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

  console.log(data);

  const handleEdit = (record) => {
    setSelectedProduct(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (record) => {
    setDeleteProduct(record);
    setIsDeleteModalVisible(true);
  };

  // const handleCreateNewProduct = () => {
  //   setSelectedProduct({
  //               "name": "",
  //               "description": "",
  //               "imageURL": "https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification14.jpg?alt=media&token=e368f6f4-6059-4014-bdb3-726571e8c11a",
  //               "specification": {
  //                   "id": 14,
  //                   "type": "Earrings",
  //                   "style": "Drop",
  //                   "occasion": "Cocktail",
  //                   "length": "N/A",
  //                   "metal": {
  //                       "id": 5,
  //                       "name": "Gold",
  //                       "unit": "Gram 22K",
  //                       "price": 70.68,
  //                       "updatedTime": "00:15 23-07-2024"
  //                   },
  //                   "texture": "Smooth",
  //                   "chainType": "N/A",
  //                   "gemstone": {
  //                       "id": 14,
  //                       "type": {
  //                           "id": 5,
  //                           "name": "Amethyst",
  //                           "basePricePerCarat": 3630.06,
  //                           "status": true
  //                       },
  //                       "shape": "PRINCESS",
  //                       "cut": "FAIR",
  //                       "clarity": "FL",
  //                       "color": "H",
  //                       "caratWeight": 4.65
  //                   }
  //               }});
  //   setIsCreateModalVisible(true);
  // }

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

  const handleSave = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      id: form.formProductId.value,
      name: form.formProductName.value,
      description: form.formProductDescription.value,
      type: form.formProductType.value,
      style: form.formProductStyle.value,
      occasion: form.formProductOccasion.value,
      length: form.formProductLength.value,
      metal: form.formProductMetal.value,
      texture: form.formProductTexture.value,
      chainType: form.formProductChainType.value,
      gemstoneName: form.formProductGemstoneName.value,
      gemstoneShape: form.formProductGemstoneShape.value,
      gemstoneCut: form.formProductGemstoneCut.value,
      gemstoneClarity: form.formProductGemstoneClarity.value,
      gemstoneColor: form.formProductGemstoneColor.value,
      gemstoneCaratWeight: form.formProductGemstoneCaratWeight.value,
    };
    const newData = data.map((item) => (item.id === values.id ? values : item));
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
      type: form.formProductType.value,
      style: form.formProductStyle.value,
      occasion: form.formProductOccasion.value,
      length: form.formProductLength.value,
      metal: form.formProductMetal.value,
      texture: form.formProductTexture.value,
      chainType: form.formProductChainType.value,
      gemstoneName: form.formProductGemstoneName.value,
      gemstoneShape: form.formProductGemstoneShape.value,
      gemstoneCut: form.formProductGemstoneCut.value,
      gemstoneClarity: form.formProductGemstoneClarity.value,
      gemstoneColor: form.formProductGemstoneColor.value,
      gemstoneCaratWeight: form.formProductGemstoneCaratWeight.value,
    };

    if (!newProduct.id || !newProduct.name || !newProduct.description) {
      alert("Please fill in all fields");
      return;
    }

    axios({
      method: "POST",
      url: `${ServerUrl}/api/products`,
      headers: { "Content-Type": "application/json" },
      data: newProduct,
    })
      .then((res) => {
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
      <div className="mb-2">
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          Welcome, {decodedToken.first_name}!
        </p>
        <p style={{ fontSize: 18 }}>Product Management</p>
      </div>
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
          }}
        >
          <div onClick={() => setShowEditing(true)}>
            <Button>
              <FiPlus />
              New Product
            </Button>
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
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit size={20} />
                  </Button>
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <FaTrash size={20} />
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
            ...(currentPage === 1 ? styles.paginationButtonDisabled : {}),
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
      <Modal show={isModalVisible} onHide={handleCancel} centered>
        <Modal.Header>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="productName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    // value={productDetails.name}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="productImage">
                  <Form.Label>Image</Form.Label>
                  {/*  onChange={handleImageChange} */}
                  <Form.Control type="file" />  
                  {/* <Image src={imageDetails.imageURL} fluid thumbnail /> */}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                // value={productDetails.description}
                // onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group controlId="chainType">
                  <Form.Label>Chain Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.chainType"
                    // value={productDetails.specification.chainType}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gemstoneWeight">
                  <Form.Label>Gemstone Weight</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="specification.gemstoneWeight"
                    // value={productDetails.specification.gemstoneWeight}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="length">
                  <Form.Label>Length</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.length"
                    // value={productDetails.specification.length}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="metalWeight">
                  <Form.Label>Metal Weight</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="specification.metalWeight"
                    // value={productDetails.specification.metalWeight}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="occasion">
                  <Form.Label>Occasion</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.occasion"
                    // value={productDetails.specification.occasion}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="style">
                  <Form.Label>Style</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.style"
                    // value={productDetails.specification.style}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="texture">
                  <Form.Label>Texture</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.texture"
                    // value={productDetails.specification.texture}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.type"
                    // value={productDetails.specification.type}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <h5>Gemstone Details</h5>
            <Row>
              <Col md={6}>
                <Form.Group controlId="gemstoneId">
                  <Form.Label>Gemstone ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="specification.gemstone.id"
                    // value={productDetails.specification.gemstone.id}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="caratWeightFrom">
                  <Form.Label>Carat Weight From</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="specification.gemstone.caratWeightFrom"
                    // value={productDetails.specification.gemstone.caratWeightFrom}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="caratWeightTo">
                  <Form.Label>Carat Weight To</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="specification.gemstone.caratWeightTo"
                    // value={productDetails.specification.gemstone.caratWeightTo}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="clarity">
                  <Form.Label>Clarity</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.gemstone.clarity"
                    // value={productDetails.specification.gemstone.clarity}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="color">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.gemstone.color"
                    // value={productDetails.specification.gemstone.color}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cut">
                  <Form.Label>Cut</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.gemstone.cut"
                    // value={productDetails.specification.gemstone.cut}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="gemstoneName">
                  <Form.Label>Gemstone Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.gemstone.name"
                    // value={productDetails.specification.gemstone.name}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="pricePerCaratInHundred">
                  <Form.Label>Price per Carat (in hundred)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="specification.gemstone.pricePerCaratInHundred"
                    // value={productDetails.specification.gemstone.pricePerCaratInHundred}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="shape">
                  <Form.Label>Shape</Form.Label>
                  <Form.Control
                    type="text"
                    name="specification.gemstone.shape"
                    // value={productDetails.specification.gemstone.shape}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="metalId">
                  <Form.Label>Metal ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="specification.metal.id"
                    // value={productDetails.specification.metal.id}
                    // onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          )}
        </Modal.Body>
      </Modal>
      <EditProductModal
        show={showEditing}
        onHide={() => setShowEditing(!showEditing)}
      />
      <Modal show={isDeleteModalVisible} onHide={handleCancelDelete} centered>
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
    </div>
  );
}

// function ProductEditor ({selectedProduct}) {
//   const newProduct = {
//     "name": "",
//     "description": "",
//     "imageURL": "",
//     "specification": {
//         "type": "",
//         "style": "",
//         "occasion": "",
//         "length": "",
//         "metal": {
//             "id": 5,
//             "name": "Gold",
//             "unit": "Gram 22K",
//             "price": 70.68,
//             "updatedTime": "00:15 23-07-2024"
//         },
//         "texture": "Smooth",
//         "chainType": "N/A",
//         "gemstone": {
//             "id": 14,
//             "type": {
//                 "id": 5,
//                 "name": "Amethyst",
//                 "basePricePerCarat": 3630.06,
//                 "status": true
//             },
//             "shape": "PRINCESS",
//             "cut": "FAIR",
//             "clarity": "FL",
//             "color": "H",
//             "caratWeight": 4.65
//         }
//     }};
//     const productSpecification = {
//       type: formState.selectedType,
//       style: formState.selectedStyle,
//       occasion: formState.selectedOccasion,
//       length: formState.selectedLength,
//       metal: formState.selectedMetal,
//       texture: formState.selectedTexture,
//       chainType: formState.selectedChainType,
//       gemstone: {
//         type: formState.selectedGemstoneType,
//         shape: formState.selectedGemstoneShape.shape,
//         cut: formState.selectedGemstoneCut.cutQuality,
//         clarity: formState.selectedGemstoneClarity.clarity,
//         color: formState.selectedGemstoneColor.color,
//         caratWeight: formState.selectedGemstoneWeight,
//       },
//     };
// }
