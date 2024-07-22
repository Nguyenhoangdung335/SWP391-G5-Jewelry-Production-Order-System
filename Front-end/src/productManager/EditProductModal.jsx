import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";

const EditProductModal = ({ show, onHide, product = defaultProduct }) => {
  const [productDetails, setProductDetails] = useState(product);

  const handleProductChange = (key, value) => {
    const keys = key.split(".");
    let updatedProduct = { ...productDetails };

    let temp = updatedProduct;
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;

    setProductDetails(updatedProduct);
  };

  const handleSave = () => {
    // Handle saving logic here
    console.log("Product details saved:", productDetails);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Row>
                <Col md={6}>
                    {/* Product Name */}
                    <Form.Group controlId="formProductName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                        type="text"
                        value={productDetails.name}
                        onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value }) }
                        />
                    </Form.Group>

                    {/* Product Description */}
                    <Form.Group controlId="formProductDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows={3}
                        value={productDetails.description}
                        onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value }) }
                        />
                    </Form.Group>

                    {/* Product Image URL */}
                    <Form.Group controlId="formProductImageURL">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                        type="text"
                        value={productDetails.imageURL}
                        onChange={(e) =>
                            setProductDetails({ ...productDetails, imageURL: e.target.value })
                        }
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    {/* Product Specification */}
                    <ProductSpecificationTable
                        selectedProduct={productDetails}
                        isEditing={true}
                    />
                </Col>
            </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;

const defaultProduct = {
    name: "",
    description: "",
    imageURL: "",
    specification: {
      type: "",
      style: "",
      occasion: "",
      length: "",
      metal: {
        name: "",
        unit: "",
        price: 0,
        updatedTime: "",
      },
      texture: "",
      chainType: "",
      gemstone: {
        type: {
          name: "",
          basePricePerCarat: 0,
          status: false,
        },
        shape: "",
        cut: "",
        clarity: "",
        color: "",
        caratWeight: 0,
      },
    },
  };