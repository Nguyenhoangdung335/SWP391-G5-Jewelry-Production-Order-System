import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import ResizeImage from "../reusable/ResizeImage";
import ServerUrl from "../reusable/ServerUrl";
import { useAlert } from "../provider/AlertProvider";
import noImage from "../assets/no_image.jpg";  // Importing noImage

const EditProductModal = ({ show, onHide, product = defaultProduct }) => {
  const { showAlert } = useAlert();
  const [productDetails, setProductDetails] = useState(product);
  const [imageDetails, setImageDetails] = useState({
    imageURL: product.imageURL || noImage,  // Using noImage as default
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
    await handleDesignImageSubmit();
    const response = await axios.post(`${ServerUrl}/api/products`, productDetails, {
      headers: { "Content-Type": "application/json" },
    });
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

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({
      ...productDetails,
      specification: {
        ...productDetails.specification,
        [name]: value,
      },
    });
  };

  const handleLengthChange = (e) => {
    const value = parseFloat(e.target.value);
    setProductDetails({
      ...productDetails,
      specification: {
        ...productDetails.specification,
        length: value,
      },
    });
  };

  const handleCaratWeightChange = (e) => {
    const value = parseFloat(e.target.value);
    setProductDetails({
      ...productDetails,
      specification: {
        ...productDetails.specification,
        gemstone: {
          ...productDetails.specification.gemstone,
          caratWeight: value,
        },
      },
    });
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
              {imageDetails.imageURL && (
                <div>
                  <Image src={imageDetails.imageURL || noImage} fluid />
                </div>
              )}
              {/* Product Name */}
              <Form.Group controlId="formProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={productDetails.name}
                  onChange={(e) =>
                    setProductDetails({ ...productDetails, name: e.target.value })
                  }
                />
              </Form.Group>

              {/* Product Description */}
              <Form.Group controlId="formProductDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={productDetails.description}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      description: e.target.value,
                    })
                  }
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
              <Form.Group controlId="formProductType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={productDetails.specification.type}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Type</option>
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Earrings">Earrings</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductStyle">
                <Form.Label>Style</Form.Label>
                <Form.Select
                  name="style"
                  value={productDetails.specification.style}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Style</option>
                  <option value="Casual">Casual</option>
                  <option value="Formal">Formal</option>
                  <option value="Sporty">Sporty</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductOccasion">
                <Form.Label>Occasion</Form.Label>
                <Form.Select
                  name="occasion"
                  value={productDetails.specification.occasion}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Occasion</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party</option>
                  <option value="Daily">Daily</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductLength">
                <Form.Label>Length*: {productDetails.specification.length} inches</Form.Label>
                <Form.Range
                  value={productDetails.specification.length}
                  min={0}
                  max={20}
                  step={0.1}
                  onChange={handleLengthChange}
                />
              </Form.Group>

              <Form.Group controlId="formProductMetal">
                <Form.Label>Metal</Form.Label>
                <Form.Select
                  name="metal"
                  value={productDetails.specification.metal.name}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Metal</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Platinum">Platinum</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductTexture">
                <Form.Label>Texture</Form.Label>
                <Form.Select
                  name="texture"
                  value={productDetails.specification.texture}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Texture</option>
                  <option value="Polished">Polished</option>
                  <option value="Matte">Matte</option>
                  <option value="Brushed">Brushed</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductChainType">
                <Form.Label>Chain Type</Form.Label>
                <Form.Select
                  name="chainType"
                  value={productDetails.specification.chainType}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Chain Type</option>
                  <option value="Cable">Cable</option>
                  <option value="Rope">Rope</option>
                  <option value="Box">Box</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductGemstoneName">
                <Form.Label>Gemstone Name</Form.Label>
                <Form.Select
                  name="gemstoneName"
                  value={productDetails.specification.gemstone.type.name}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Gemstone</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Sapphire">Sapphire</option>
                  <option value="Emerald">Emerald</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductGemstoneShape">
                <Form.Label>Gemstone Shape</Form.Label>
                <Form.Select
                  name="gemstoneShape"
                  value={productDetails.specification.gemstone.shape}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Shape</option>
                  <option value="Round">Round</option>
                  <option value="Oval">Oval</option>
                  <option value="Princess">Princess</option>
                  <option value="Emerald">Emerald</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductGemstoneCut">
                <Form.Label>Gemstone Cut</Form.Label>
                <Form.Select
                  name="gemstoneCut"
                  value={productDetails.specification.gemstone.cut}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Cut</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductGemstoneClarity">
                <Form.Label>Gemstone Clarity</Form.Label>
                <Form.Select
                  name="gemstoneClarity"
                  value={productDetails.specification.gemstone.clarity}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Clarity</option>
                  <option value="IF">IF</option>
                  <option value="VVS1">VVS1</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1</option>
                  <option value="VS2">VS2</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductGemstoneColor">
                <Form.Label>Gemstone Color</Form.Label>
                <Form.Select
                  name="gemstoneColor"
                  value={productDetails.specification.gemstone.color}
                  onChange={handleSpecificationChange}
                >
                  <option value="">Select Color</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formProductGemstoneCaratWeight">
                <Form.Label>Gemstone Carat Weight*: {productDetails.specification.gemstone.caratWeight} Carat</Form.Label>
                <Form.Range
                  value={productDetails.specification.gemstone.caratWeight}
                  min={0.01}
                  max={5}
                  step={0.01}
                  onChange={handleCaratWeightChange}
                  name="gemstoneCaratWeight"
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
  description: "",
  imageURL: noImage,  // Setting noImage as default
  specification: {
    type: "",
    style: "",
    occasion: "",
    length: 0,
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
      caratWeight: 0.01,
    },
  },
};
