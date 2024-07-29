import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import ResizeImage from "../reusable/ResizeImage";
import ServerUrl from "../reusable/ServerUrl";
import { useAlert } from "../provider/AlertProvider";
import noImage from "../assets/no_image.jpg"; // Importing noImage

const EditProductModal = ({ show, onHide, product = defaultProduct }) => {
  const { showAlert } = useAlert();
  const [productDetails, setProductDetails] = useState(product);
  console.log(productDetails);
  const [imageDetails, setImageDetails] = useState({
    imageURL: product.imageURL || noImage, // Using noImage as default
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    const newProductDetails = { ...productDetails };

    if (keys.length === 1) {
      newProductDetails[keys[0]] = value;
    } else if (keys.length === 2) {
      newProductDetails[keys[0]] = {
        ...newProductDetails[keys[0]],
        [keys[1]]: value,
      };
    } else if (keys.length === 3) {
      newProductDetails[keys[0]] = {
        ...newProductDetails[keys[0]],
        [keys[1]]: {
          ...newProductDetails[keys[0]][keys[1]],
          [keys[2]]: value,
        },
      };
    }

    setProductDetails(newProductDetails);
  };

  const handleSave = async () => {
    try {
      if (imageDetails.imageFile) {
        await handleDesignImageSubmit();
      }

      const response = await axios.post(`${ServerUrl}/api/products`, {
        ...productDetails,
        imageURL: imageDetails.imageURL,
      });

      if (response.status === 200) {
        showAlert("Product added successfully!", "success");
        onHide();
      }
    } catch (error) {
      showAlert("Failed to add product. Please try again.", "danger");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="productName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="productImage">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                <Image src={imageDetails.imageURL} fluid thumbnail />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="productDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={productDetails.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group controlId="chainType">
                <Form.Label>Chain Type</Form.Label>
                <Form.Control
                  type="text"
                  name="specification.chainType"
                  value={productDetails.specification.chainType}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstoneWeight}
                  onChange={handleChange}
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
                  value={productDetails.specification.length}
                  onChange={handleChange}
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
                  value={productDetails.specification.metalWeight}
                  onChange={handleChange}
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
                  value={productDetails.specification.occasion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="style">
                <Form.Label>Style</Form.Label>
                <Form.Control
                  type="text"
                  name="specification.style"
                  value={productDetails.specification.style}
                  onChange={handleChange}
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
                  value={productDetails.specification.texture}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  name="specification.type"
                  value={productDetails.specification.type}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.id}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.caratWeightFrom}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.caratWeightTo}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="clarity">
                <Form.Label>Clarity</Form.Label>
                <Form.Control
                  type="text"
                  name="specification.gemstone.clarity"
                  value={productDetails.specification.gemstone.clarity}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.color}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="cut">
                <Form.Label>Cut</Form.Label>
                <Form.Control
                  type="text"
                  name="specification.gemstone.cut"
                  value={productDetails.specification.gemstone.cut}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.name}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.pricePerCaratInHundred}
                  onChange={handleChange}
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
                  value={productDetails.specification.gemstone.shape}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="metalId">
                <Form.Label>Metal ID</Form.Label>
                <Form.Control
                  type="number"
                  name="specification.metal.id"
                  value={productDetails.specification.metal.id}
                  onChange={handleChange}
                />
              </Form.Group>
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
  imageURL: " ",
  description: "",
  specification: {
    chainType: "",
    gemstoneWeight: 0,
    length: "",
    metalWeight: 0,
    occasion: "",
    style: "",
    texture: "",
    type: "",
    gemstone: {
      id: 0,
      caratWeightFrom: 0,
      caratWeightTo: 0,
      clarity: "",
      color: "",
      cut: "",
      name: "",
      pricePerCaratInHundred: 0,
      shape: "",
    },
    metal: {
      id: 0,
    },
  },
};
