import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Image } from "react-bootstrap";
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
  const [productDetails, setProductDetails] = useState({});
  const [imageDetails, setImageDetails] = useState({});

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
    setProductDetails(record);
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
        setIsDeleteModalVisible(false);
        setDeleteProduct(null);

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
    const updatedProduct = {
      ...productDetails,
      name: form.formProductName.value,
      description: form.formProductDescription.value,
      specification: {
        ...productDetails.specification,
        type: form.formProductType.value,
        style: form.formProductStyle.value,
        occasion: form.formProductOccasion.value,
        length: form.formProductLength.value,
        metal: {
          name: form.formProductMetal.value,
          id: productDetails.specification.metal.id,
        },
        texture: form.formProductTexture.value,
        chainType: form.formProductChainType.value,
        gemstone: {
          name: form.formProductGemstoneName.value,
          shape: form.formProductGemstoneShape.value,
          cut: form.formProductGemstoneCut.value,
          clarity: form.formProductGemstoneClarity.value,
          color: form.formProductGemstoneColor.value,
          caratWeight: form.formProductGemstoneCaratWeight.value,
          id: productDetails.specification.gemstone.id,
        },
      },
      imageURL: imageDetails.imageURL || selectedProduct.imageURL,
    };
  
    axios({
      method: "PUT",
      url: `${ServerUrl}/api/products`,
      headers: { "Content-Type": "application/json" },
      data: updatedProduct,
    })
      .then((res) => {
        const newData = data.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item
        );
        setData(newData);
        setIsModalVisible(false);
        setSelectedProduct(null);
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        alert("There was an error updating the product. Please try again.");
      });
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("imageFile", file);

    axios({
      method: "POST",
      url: `${ServerUrl}/api/products/image`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        setImageDetails({ imageURL: response.data });
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        alert("There was an error uploading the image. Please try again.");
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
      <Form onSubmit={handleSave}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={selectedProduct.name}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
              <Image
                src={imageDetails.imageURL || selectedProduct.imageURL}
                fluid
                thumbnail
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formProductDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            defaultValue={selectedProduct.description}
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="specification.type"
                defaultValue={selectedProduct.specification.type}
              >
                <option value="">Select type</option>
                <option value="Rings">Rings</option>
                <option value="Necklace">Necklace</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Anklet">Anklet</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductStyle">
              <Form.Label>Style</Form.Label>
              <Form.Select
                name="specification.style"
                defaultValue={selectedProduct.specification.style}
              >
                <option value={selectedProduct.specification.style}>{selectedProduct.specification.style}</option>
                <option value="Historic">Historic</option>
                <option value="Georgian">Georgian</option>
                <option value="Victorian">Victorian</option>
                <option value="Edwardian">Edwardian</option>
                <option value="Art nouveau">Art nouveau</option>
                <option value="Art deco">Art deco</option>
                <option value="Retro">Retro</option>
                <option value="Modernist">Modernist</option>
                <option value="Minimalistic">Minimalistic</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Cultural">Cultural</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
        <Col md={6}>
          <Form.Group controlId="formProductGemstoneId">
            <Form.Label>Gemstone ID</Form.Label>
            <Form.Control
              type="number"
              name="gemstoneId"
              value={productDetails.specification?.gemstone?.id || ''}
              onChange={(e) => setProductDetails({
                ...productDetails,
                specification: {
                  ...productDetails.specification,
                  gemstone: {
                    ...productDetails.specification.gemstone,
                    id: e.target.value,
                  },
                },
              })}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formProductMetalId">
            <Form.Label>Metal ID</Form.Label>
            <Form.Control
              type="number"
              name="metalId"
              value={productDetails.specification?.metal?.id || ''}
              onChange={(e) => setProductDetails({
                ...productDetails,
                specification: {
                  ...productDetails.specification,
                  metal: {
                    ...productDetails.specification.metal,
                    id: e.target.value,
                  },
                },
              })}
            />
          </Form.Group>
        </Col>
      </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductOccasion">
              <Form.Label>Occasion</Form.Label>
              <Form.Select
                name="specification.occasion"
                defaultValue={selectedProduct.specification.occasion}
              >
                <option value={selectedProduct.specification.occasion}>{selectedProduct.specification.occasion}</option>
                <option value="Engagement">Engagement</option>
                <option value="Wedding">Wedding</option>
                <option value="Anniversaries">Anniversaries</option>
                <option value="Birthdays">Birthdays</option>
                <option value="Formal Events">Formal Events</option>
                <option value="Working days">Working days</option>
                <option value="Dinner date">Dinner date</option>
                <option value="Holiday">Holiday</option>
                <option value="Informal gathering">Informal gathering</option>
                <option value="Everyday uses">Everyday uses</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductLength">
              <Form.Label>Length</Form.Label>
              <Form.Select
                name="specification.length"
                defaultValue={selectedProduct.specification.length}
              >
                <option value={selectedProduct.specification.length}>{selectedProduct.specification.length}</option>
                <option value="XS">X-Small</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">X-Large</option>
                <option value="XXL">XX-Large</option>
                <option value="XXXL">XXX-Large</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductMetal">
              <Form.Label>Metal</Form.Label>
              <Form.Select
                name="specification.metal.name"
                defaultValue={selectedProduct.specification.metal.name}
              >
                <option value="">Select metal</option>
                <option value="Gold">Gold</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductTexture">
              <Form.Label>Texture</Form.Label>
              <Form.Select
                name="specification.texture"
                defaultValue={selectedProduct.specification.texture}
              >
                <option value={selectedProduct.specification.texture}>{selectedProduct.specification.texture}</option>
                <option value="Polished">Polished</option>
                <option value="Satin">Satin</option>
                <option value="Brushed">Brushed</option>
                <option value="Wire Brushed">Wire Brushed</option>
                <option value="Sand Blasted">Sand Blasted</option>
                <option value="Bead Blasted">Bead Blasted</option>
                <option value="Stone">Stone</option>
                <option value="Hammered">Hammered</option>
                <option value="Florentine">Florentine</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductChainType">
              <Form.Label>Chain Type</Form.Label>
              <Form.Select
                name="specification.chainType"
                defaultValue={selectedProduct.specification.chainType}
              >
                <option value={selectedProduct.specification.chainType}>{selectedProduct.specification.chainType}</option>
                <option value="Bead">Bead</option>
                <option value="Box">Box</option>
                <option value="Byzantine">Byzantine</option>
                <option value="Cable">Cable</option>
                <option value="Solid Cable">Solid Cable</option>
                <option value="Curb">Curb</option>
                <option value="Figaro">Figaro</option>
                <option value="Mesh">Mesh</option>
                <option value="Omega">Omega</option>
                <option value="Palma">Palma</option>
                <option value="Popcorn">Popcorn</option>
                <option value="Rolo">Rolo</option>
                <option value="Rope">Rope</option>
                <option value="San Marco">San Marco</option>
                <option value="Singapore">Singapore</option>
                <option value="Snake">Snake</option>
                <option value="Wheat">Wheat</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductGemstoneName">
              <Form.Label>Gemstone Name</Form.Label>
              <Form.Select
                name="specification.gemstone.name"
                defaultValue={selectedProduct.specification.gemstone.name}
              >
                <option value="">Select gemstone name</option>
                <option value="Diamond">Diamond</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductGemstoneShape">
              <Form.Label>Gemstone Shape</Form.Label>
              <Form.Select
                name="specification.gemstone.shape"
                defaultValue={selectedProduct.specification.gemstone.shape}
              >
                <option value="">Select gemstone shape</option>
                <option value="ROUND">ROUND</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductGemstoneCut">
              <Form.Label>Gemstone Cut</Form.Label>
              <Form.Select
                name="specification.gemstone.cut"
                defaultValue={selectedProduct.specification.gemstone.cut}
              >
                <option value="">Select gemstone cut</option>
                <option value="EXCELLENT">EXCELLENT</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductGemstoneClarity">
              <Form.Label>Gemstone Clarity</Form.Label>
              <Form.Select
                name="specification.gemstone.clarity"
                defaultValue={selectedProduct.specification.gemstone.clarity}
              >
                <option value="">Select gemstone clarity</option>
                <option value="I1">I1</option>
                <option value="I2">I2</option>
                <option value="I3">I3</option>
                <option value="IF_VVS">IF/VVS</option>
                <option value="S3">S3</option>
                <option value="SI1">SI1</option>
                <option value="SI2">SI2</option>
                <option value="VS1">VS1</option>
                <option value="VS2">VS2</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formProductGemstoneColor">
              <Form.Label>Gemstone Color</Form.Label>
              <Form.Select
                name="specification.gemstone.color"
                defaultValue={selectedProduct.specification.gemstone.color}
              >
                <option value="">Select gemstone color</option>
                <option value="D">D</option>
                <option value="G">G</option>
                <option value="I">I</option>
                <option value="K">K</option>
                <option value="M">M</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formProductGemstoneCaratWeight">
              <Form.Label>Gemstone Carat Weight</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="specification.gemstone.caratWeight"
                defaultValue={selectedProduct.specification.gemstoneWeight}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
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
