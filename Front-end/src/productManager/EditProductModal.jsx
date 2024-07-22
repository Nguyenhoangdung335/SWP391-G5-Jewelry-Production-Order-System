import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Image } from "react-bootstrap";
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";
import axios from "axios";
import ResizeImage from "../reusable/ResizeImage";
import ServerUrl from "../reusable/ServerUrl";
import { useAlert } from "../provider/AlertProvider";

const EditProductModal = ({ show, onHide, product = defaultProduct }) => {
    const {showAlert} = useAlert();
  const [productDetails, setProductDetails] = useState(product);
  const [imageDetails, setImageDetails] = useState({
    imageURL: "",
    imageFile: null,
  });

  const handleDesignImageSubmit = async () => {
    const formData = new FormData();

    if (imageDetails.imageFile instanceof File) {
      const resizedImageFile = await ResizeImage(imageDetails.imageFile);
      formData.append("file", resizedImageFile);
      const response = await axios.post(
        `${ServerUrl}/api/products/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        setImageDetails({
            ...imageDetails,
            imageURL: response.data,
        });
      }
    } else {
      console.error("designImage is not a File");
    }
  };

  const handleSave = async () => {
    handleDesignImageSubmit();
    setProductDetails({
        ...productDetails,
        imageURL: imageDetails.imageURL
    });
    const response = await axios.post(`${ServerUrl}/api/products`);
    if (response.status === 200) {
        showAlert("Product updated successfully", "", "success");
        onHide();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDetails({
          ...imageDetails,
          imageFile: file,
          imageURL: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
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
                    {imageDetails.imageURL && (
                        <div >
                            <Image src={imageDetails.imageURL} fluid />
                        </div>
                    )}
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

                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
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
      },
      texture: "",
      chainType: "",
      gemstone: {
        type: {
          name: "",
        },
        shape: "",
        cut: "",
        clarity: "",
        color: "",
        caratWeight: 0,
      },
    },
  };