import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import ResizeImage from "../reusable/ResizeImage";
import ServerUrl from "../reusable/ServerUrl";
import { useAlert } from "../provider/AlertProvider";
import noImage from "../assets/no_image.jpg";

const EditProductModal = ({ show, onHide, product = defaultProduct }) => {
    const { showAlert } = useAlert();
    const [productDetails, setProductDetails] = useState(product);
    const [imageDetails, setImageDetails] = useState({
        imageURL: product.imageURL || noImage, // Sử dụng noImage làm mặc định
        imageFile: null,
    });

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
            const handleDesignImageSubmit = async () => {
                const formData = new FormData();

                if (imageDetails.imageFile instanceof File) {
                    const resizedImageFile = await ResizeImage(
                        imageDetails.imageFile
                    );
                    formData.append("imageFile", resizedImageFile);
                    const response = await axios.post(
                        `${ServerUrl}/api/products/image`,
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" },
                        }
                    );
                    if (response.status === 200) {
                        await setImageDetails({
                            ...imageDetails,
                            imageURL: response.data,
                        });
                        const responseProduct = await axios.post(
                            `${ServerUrl}/api/products`,
                            {
                                ...productDetails,
                                imageURL: response.data,
                            }
                        );

                        if (responseProduct.status === 200) {
                            showAlert("Product added successfully!", "success");
                            onHide();
                        }
                    }
                } else {
                    console.error("designImage is not a File");
                }
            };
            await handleDesignImageSubmit();
        } catch (error) {
            console.log(error);
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
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <Image
                                    src={imageDetails.imageURL}
                                    fluid
                                    thumbnail
                                />
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
                                    as="select"
                                    name="specification.chainType"
                                    value={
                                        productDetails.specification.chainType
                                    }
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "Default", name: "Default" },
                                        { value: "Bead", name: "Bead" },
                                        { value: "Box", name: "Box" },
                                        {
                                            value: "Byzantine",
                                            name: "Byzantine",
                                        },
                                        { value: "Cable", name: "Cable" },
                                        {
                                            value: "Solid Cable",
                                            name: "Solid Cable",
                                        },
                                        { value: "Curb", name: "Curb" },
                                        { value: "Figaro", name: "Figaro" },
                                        { value: "Mesh", name: "Mesh" },
                                        { value: "Omega", name: "Omega" },
                                        { value: "Palma", name: "Palma" },
                                        { value: "Popcorn", name: "Popcorn" },
                                        { value: "Rolo", name: "Rolo" },
                                        { value: "Rope", name: "Rope" },
                                        {
                                            value: "San Marco",
                                            name: "San Marco",
                                        },
                                        {
                                            value: "Singapore",
                                            name: "Singapore",
                                        },
                                        { value: "Snake", name: "Snake" },
                                        { value: "Wheat", name: "Wheat" },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="gemstoneWeight">
                                <Form.Label>Gemstone Weight</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="specification.gemstoneWeight"
                                    value={
                                        productDetails.specification
                                            .gemstoneWeight
                                    }
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
                                    as="select"
                                    name="specification.length"
                                    value={productDetails.specification.length}
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "XS", name: "X-Small" },
                                        { value: "S", name: "Small" },
                                        { value: "M", name: "Medium" },
                                        { value: "L", name: "Large" },
                                        { value: "XL", name: "X-Large" },
                                        { value: "XXL", name: "XX-Large" },
                                        { value: "XXXL", name: "XXX-Large" },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="metalWeight">
                                <Form.Label>Metal Weight</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="specification.metalWeight"
                                    value={
                                        productDetails.specification.metalWeight
                                    }
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="occasion">
                                <Form.Label>Occasion</Form.Label>
                                <Form.Select
                                    name="specification.occasion"
                                    value={
                                        productDetails.specification.occasion
                                    }
                                    onChange={handleChange}
                                >
                                    {occasions.map((occasion) => (
                                        <option
                                            key={occasion.value}
                                            value={occasion.value}
                                        >
                                            {occasion.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="style">
                                <Form.Label>Style</Form.Label>
                                <Form.Select
                                    name="specification.style"
                                    value={productDetails.specification.style}
                                    onChange={handleChange}
                                >
                                    {styles.map((style) => (
                                        <option
                                            key={style.value}
                                            value={style.value}
                                        >
                                            {style.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="texture">
                                <Form.Label>Texture</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.texture"
                                    value={productDetails.specification.texture}
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "Default", name: "Default" },
                                        { value: "Polished", name: "Polished" },
                                        { value: "Satin", name: "Satin" },
                                        { value: "Brushed", name: "Brushed" },
                                        {
                                            value: "Wire Brushed",
                                            name: "Wire Brushed",
                                        },
                                        {
                                            value: "Sand Blasted",
                                            name: "Sand Blasted",
                                        },
                                        {
                                            value: "Bead Blasted",
                                            name: "Bead Blasted",
                                        },
                                        { value: "Stone", name: "Stone" },
                                        { value: "Hammered", name: "Hammered" },
                                        {
                                            value: "Florentine",
                                            name: "Florentine",
                                        },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="type">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.type"
                                    value={productDetails.specification.type}
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "Rings", name: "Rings" },
                                        { value: "Necklace", name: "Necklace" },
                                        { value: "Earrings", name: "Earrings" },
                                        { value: "Bracelet", name: "Bracelet" },
                                        { value: "Anklet", name: "Anklet" },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Control>
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
                                    value={
                                        productDetails.specification.gemstone.id
                                    }
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
                                    value={
                                        productDetails.specification.gemstone
                                            .caratWeightFrom
                                    }
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
                                    value={
                                        productDetails.specification.gemstone
                                            .caratWeightTo
                                    }
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="clarity">
                                <Form.Label>Clarity</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.gemstone.clarity"
                                    value={
                                        productDetails.specification.gemstone
                                            .clarity
                                    }
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "I1", name: "I1" },
                                        { value: "I2", name: "I2" },
                                        { value: "I3", name: "I3" },
                                        { value: "IF_VVS", name: "IF/VVS" },
                                        { value: "S3", name: "S3" },
                                        { value: "SI1", name: "SI1" },
                                        { value: "SI2", name: "SI2" },
                                        { value: "VS1", name: "VS1" },
                                        { value: "VS2", name: "VS2" },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                    onChange={handleChange}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="color">
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.gemstone.color"
                                    value={
                                        productDetails.specification.gemstone
                                            .color
                                    }
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "D", name: "D" },
                                        { value: "G", name: "G" },
                                        { value: "I", name: "I" },
                                        { value: "K", name: "K" },
                                        { value: "M", name: "M" },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                    onChange={handleChange}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="cut">
                                <Form.Label>Cut</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.gemstone.cut"
                                    value={
                                        productDetails.specification.gemstone
                                            .cut
                                    }
                                    onChange={handleChange}
                                >
                                    {[
                                        {
                                            value: "EXCELLENT",
                                            name: "EXCELLENT",
                                        },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="gemstoneName">
                                <Form.Label>Gemstone Name</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.gemstone.name"
                                    value={
                                        productDetails.specification.gemstone
                                            .name
                                    }
                                    onChange={handleChange}
                                >
                                    {[
                                        { value: "Diamond", name: "Diamond" },
                                    ].map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="pricePerCaratInHundred">
                                <Form.Label>
                                    Price Per Carat (in Hundred)
                                </Form.Label>
                                <Form.Control
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    name="specification.gemstone.pricePerCaratInHundred"
                                    value={
                                        productDetails.specification.gemstone
                                            .pricePerCaratInHundred
                                    }
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="shape">
                                <Form.Label>Shape</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.gemstone.shape"
                                    value={
                                        productDetails.specification.gemstone
                                            .shape
                                    }
                                    onChange={handleChange}
                                >
                                    {[{ value: "ROUND", name: "ROUND" }].map(
                                        (option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.name}
                                            </option>
                                        )
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <h5>Metal Details</h5>
                    <Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="metalId">
                                    <Form.Label>Metal ID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="specification.metal.id"
                                        value={
                                            productDetails.specification.metal
                                                .id
                                        }
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Col md={6}>
                            <Form.Group controlId="metalName">
                                <Form.Label>Metal Name</Form.Label>
                                <Form.Select
                                    name="specification.metal.name"
                                    value={
                                        productDetails.specification.metal.name
                                    }
                                    onChange={handleChange}
                                >
                                    {[{ value: "Gold", name: "Gold" }].map(
                                        (option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.name}
                                            </option>
                                        )
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="companyPrice">
                                <Form.Label>Company Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="specification.metal.companyPrice"
                                    value={
                                        productDetails.specification.metal
                                            .companyPrice
                                    }
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="marketPrice">
                                <Form.Label>Market Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="specification.metal.marketPrice"
                                    value={
                                        productDetails.specification.metal
                                            .marketPrice
                                    }
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="metalUnit">
                                <Form.Label>Unit</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="specification.metal.unit"
                                    value={
                                        productDetails.specification.metal.unit
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="">Select unit</option>
                                    <option value="Gram 10K">Gram 10K</option>
                                    <option value="Gram 12K">Gram 12K</option>
                                    <option value="Gram 14K">Gram 14K</option>
                                    <option value="Gram 18K">Gram 18K</option>
                                    <option value="Gram 21K">Gram 21K</option>
                                    <option value="Gram 22K">Gram 22K</option>
                                    <option value="Gram 24K">Gram 24K</option>
                                    <option value="Kilogram">Kilogram</option>
                                    <option value="Ounce">Ounce</option>
                                    <option value="Tola">Tola</option>
                                </Form.Control>
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

const defaultProduct = {
    name: "",
    imageURL: noImage,
    description: "",
    specification: {
        chainType: "",
        gemstoneWeight: "",
        length: "",
        metalWeight: "",
        occasion: "",
        style: "",
        texture: "",
        type: "",
        gemstone: {
            id: "",
            caratWeightFrom: "",
            caratWeightTo: "",
            clarity: "I1",
            color: "D",
            cut: "EXCELLENT",
            name: "Diamond",
            pricePerCaratInHundred: "",
            shape: "ROUND",
        },
        metal: {
            id: "",
            name: "Gold",
            companyPrice: 0,
            marketPrice: 0,
            unit: "",
        },
    },
};

const occasions = [
    { value: "Engagement", name: "Engagement" },
    { value: "Wedding", name: "Wedding" },
    { value: "Anniversaries", name: "Anniversaries" },
    { value: "Birthdays", name: "Birthdays" },
    { value: "Formal Events", name: "Formal Events" },
    { value: "Working days", name: "Working days" },
    { value: "Dinner date", name: "Dinner date" },
    { value: "Holiday", name: "Holiday" },
    { value: "Informal gathering", name: "Informal gathering" },
    { value: "Everyday uses", name: "Everyday uses" },
];

const styles = [
    { value: "Historic", name: "Historic" },
    { value: "Georgian", name: "Georgian" },
    { value: "Victorian", name: "Victorian" },
    { value: "Edwardian", name: "Edwardian" },
    { value: "Art nouveau", name: "Art Nouveau" },
    { value: "Art deco", name: "Art Deco" },
    { value: "Retro", name: "Retro" },
    { value: "Modernist", name: "Modernist" },
    { value: "Minimalistic", name: "Minimalistic" },
    { value: "Contemporary", name: "Contemporary" },
    { value: "Cultural", name: "Cultural" },
];

export default EditProductModal;
