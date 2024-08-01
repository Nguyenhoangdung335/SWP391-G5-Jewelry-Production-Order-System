import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChainType,
  DesignStyle,
  GemstoneForm,
  ImageInput,
  JewelryType,
  Length,
  MetalForm,
  Occasion,
  Texture,
} from "../orderFlows/DesignOptionForms";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import ResizeImage from "../reusable/ResizeImage";
import { useAlert } from "../provider/AlertProvider";

const ProductEditor = ({
  product = defaultProduct,
  isShow,
  onHide,
  fetchData,
}) => {
  const { showAlert } = useAlert();
  const [formState, setFormState] = useState({
    selectedType: "",
    selectedStyle: "",
    selectedOccasion: "",
    selectedLength: "",
    selectedTexture: "",
    selectedChainType: "",
    name: "",
    description: "",
    imageURL: "",
    imageFile: null,
  });
  const [selectedGemstoneProp, setSelectedGemstoneProp] = useState({
    selectedGemstoneName: "",
    selectedGemstoneShape: "",
    selectedGemstoneCut: "",
    selectedGemstoneClarity: "",
    selectedGemstoneColor: "",
    selectedGemstoneWeight: "",
    selectedGemstone: null,
  });
  const [selectedMetalProp, setSelectedMetalProp] = useState({
    selectedMetalName: "",
    selectedMetalUnit: "",
    selectedMetal: null,
    selectedMetalWeight: "",
  });

  /* --------------useEffect to change the product detail data------------------------- */
  useEffect(() => {
    setFormState({
      selectedType: product?.specification ? product.specification.type : "",
      selectedStyle: product?.specification ? product.specification.style : "",
      selectedOccasion: product?.specification
        ? product.specification.occasion
        : "",
      selectedLength: product?.specification
        ? product.specification.length
        : "",
      selectedTexture: product?.specification
        ? product.specification.texture
        : "",
      selectedChainType: product?.specification
        ? product.specification.chainType
        : "",
      name: product ? product.name : "",
      description: product ? product.description : "",
      imageURL: product ? product.imageURL : "",
      imageFile: null,
    });
    setSelectedMetalProp({
      selectedMetalName: product?.specification?.metal
        ? product.specification.metal.name
        : "",
      selectedMetalUnit: product?.specification?.metal
        ? product.specification.metal.unit
        : "",
      selectedMetal: product?.specification
        ? product.specification.metal
        : null,
      selectedMetalWeight: product?.specification
        ? product.specification.metalWeight
        : "",
    });
    setSelectedGemstoneProp({
      selectedGemstoneName: product?.specification?.gemstone
        ? product.specification.gemstone.name
        : "",
      selectedGemstoneShape: product?.specification?.gemstone
        ? product.specification.gemstone.shape
        : "",
      selectedGemstoneCut: product?.specification?.gemstone
        ? product.specification.gemstone.cut
        : "",
      selectedGemstoneClarity: product?.specification?.gemstone
        ? product.specification.gemstone.clarity
        : "",
      selectedGemstoneColor: product?.specification?.gemstone
        ? product.specification.gemstone.color
        : "",
      selectedGemstoneWeight: product?.specification
        ? product.specification.gemstoneWeight
        : "",
      selectedGemstone: product?.specification
        ? product.specification.gemstone
        : null,
    });
  }, [product]);

  /* -----------------------useEffect to reset the gemstone, the length, texture, and chain type when choose another jewelry type ---------------------- */
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedGemstoneType: null,
      selectedGemstoneShape: "",
      selectedGemstoneCut: "",
      selectedGemstoneClarity: "",
      selectedGemstoneColor: "",
      selectedGemstoneWeight: "0",
    }));

    switch (formState.selectedType) {
      case "Necklace":
        setFormState((prev) => ({
          ...prev,
          selectedLength: "14",
          selectedTexture: "Default",
          selectedChainType: "Default",
        }));
        break;
      case "Bracelet":
        setFormState((prev) => ({
          ...prev,
          selectedLength: "",
          selectedTexture: "Default",
          selectedChainType: "Default",
        }));
        break;
      case "Earrings":
        setFormState((prev) => ({
          ...prev,
          selectedLength: "",
          selectedTexture: "Default",
          selectedChainType: "NaN",
        }));
        break;
      case "Anklet":
        setFormState((prev) => ({
          ...prev,
          selectedLength: "0",
          selectedTexture: "Default",
          selectedChainType: "Default",
        }));
        break;
      case "Rings":
        setFormState((prev) => ({
          ...prev,
          selectedLength: "0.618",
          selectedTexture: "Default",
          selectedChainType: "NaN",
        }));
        break;
      default:
        setFormState((prev) => ({ ...prev, selectedLength: "0" }));
    }
  }, [formState.selectedType]);

  useEffect(() => {
    if (selectedMetalProp.selectedMetalName) {
      setFormState((prev) => ({
        ...prev,
        selectedChainType: ["Necklace", "Bracelet", "Anklet"].includes(
          formState.selectedType
        )
          ? "Default"
          : "NaN",
        selectedTexture: "Default",
      }));
    }
  }, [selectedMetalProp.selectedMetalName, formState.selectedType]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleChangeGemstone = useCallback((e) => {
    const { name, value } = e.target;
    if (value === "") {
      setSelectedGemstoneProp((prev) => ({ ...prev, [name]: null }));
    } else {
      setSelectedGemstoneProp((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "selectedGemstoneName" && value === "" && !value) {
      setSelectedGemstoneProp({
        selectedGemstoneName: null,
        selectedGemstone: null,
      });
    } else if (name === "selectedGemstoneName" && value) {
      setSelectedGemstoneProp({
        selectedGemstoneName: value,
        selectedGemstoneShape: "",
        selectedGemstoneCut: "",
        selectedGemstoneClarity: "",
        selectedGemstoneColor: "",
        selectedGemstoneWeight: "0.05",
        selectedGemstone: null,
      });
    } else if (name === "selectedGemstoneWeight" && value) {
      setSelectedGemstoneProp((prev) => ({
        ...prev,
        selectedGemstone: null,
      }));
    }
  }, []);
  const handleChangeMetal = useCallback((e) => {
    const { name, value } = e.target;
    setSelectedMetalProp((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleChangeImage = useCallback((e) => {
    const { name, value, file } = e.target;
    if (name === "imageURL") {
      setFormState((prev) => ({ ...prev, imageFile: file, imageURL: value }));
    }
  }, []);

  const handleSubmitImage = async () => {
    if (formState.imageFile && formState.imageFile instanceof File) {
      const formData = new FormData();
      const imageFile = await ResizeImage(formState.imageFile);
      formData.append("imageFile", imageFile);
      const response = await axios.post(
        `${ServerUrl}/api/products/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        return response.data;
        // await setFormState((prev) => ({...prev, imageURL: response.data}));
      }
    }
    return formState.imageURL;
  };

  const handleSubmit = async () => {
    console.log(formState.imageURL);
    const imageURL = await handleSubmitImage();
    setFormState((prev) => ({ ...prev, imageURL }));
    console.log(formState.imageURL);
    setTimeout(async () => {
      // Add a slight delay to ensure the state is updated before proceeding
      const requestBody = {
        ...product,
        name: formState.name,
        description: formState.description,
        imageURL: imageURL, // Use the new imageURL directly
        specification: {
          type: formState.selectedType,
          style: formState.selectedStyle,
          occasion: formState.selectedOccasion,
          length: formState.selectedLength,
          metal: selectedMetalProp.selectedMetal,
          metalWeight: selectedMetalProp.selectedMetalWeight,
          texture: formState.selectedTexture,
          chainType: formState.selectedChainType,
          gemstone: selectedGemstoneProp.selectedGemstone,
          gemstoneWeight: selectedGemstoneProp.selectedGemstoneWeight,
        },
      };

      let request = null;
      if (product?.id && product?.id !== "")
        request = { ...updateRequest, data: requestBody };
      else request = { ...createRequest, data: requestBody };

      const response = await axios.request(request);
      if (response.status === 200) {
        if (fetchData) fetchData();
        showAlert("Successful", response.data.message, "success");
        onHide();
      } else {
        showAlert(
          "Error",
          response.data.message || response.data.detail,
          "danger"
        );
      }
    }, 0);
  };

  const handleDisable = () => {
    const {
      selectedStyle,
      selectedOccasion,
      selectedType,
      selectedLength,
      name,
      description,
      imageURL,
    } = formState;

    const { selectedGemstoneName, selectedGemstone } = selectedGemstoneProp;

    const { selectedMetal, selectedMetalWeight } = selectedMetalProp;

    console.log(
      selectedStyle &&
        selectedOccasion &&
        selectedType &&
        selectedMetal &&
        selectedMetalWeight &&
        selectedMetalWeight > 0 &&
        selectedLength !== "0" &&
        selectedLength &&
        (!selectedGemstoneName || (selectedGemstoneName && selectedGemstone)) &&
        name &&
        description &&
        imageURL
    );
    return !(
      selectedStyle &&
      selectedOccasion &&
      selectedType &&
      selectedMetal &&
      selectedMetalWeight &&
      selectedMetalWeight > 0 &&
      selectedLength !== "0" &&
      selectedLength &&
      (!selectedGemstoneName || (selectedGemstoneName && selectedGemstone)) &&
      name &&
      description &&
      imageURL
    );
  };

  return (
    <Modal
      size="xl"
      fullscreen="xl-down"
      centered
      keyboard
      animation
      show={isShow}
    >
      <Modal.Header closeButton style={{ width: "100%" }} onHide={onHide}>
        <h4>Product Editor</h4>
      </Modal.Header>
      <Modal.Body style={{ width: "100%" }}>
        <Container>
          <Row>
            <Col sm={5} style={{ height: "70vh", overflowY: "auto" }}>
              <ImageInput
                label="Product Image"
                initialImageUrl={formState.imageURL}
                onChange={handleChangeImage}
                urlName="imageURL"
                fileName="imageFile"
              />
              <Row className="mb-3">
                <ProductNameInput
                  value={formState.name}
                  onChange={handleChange}
                  name="name"
                />
              </Row>
              <Row className="mb-3">
                <ProductDescriptionInput
                  value={formState.description}
                  onChange={handleChange}
                  name="description"
                />
              </Row>
            </Col>
            <Col sm={7} style={{ height: "70vh", overflowY: "auto" }}>
              <Container>
                <Row>
                  <Col sm={12} md={6} lg={4}>
                    <JewelryType
                      onChange={handleChange}
                      value={formState.selectedType}
                    />
                  </Col>
                  <Col sm={12} md={6} lg={4}>
                    <DesignStyle
                      onChange={handleChange}
                      value={formState.selectedStyle}
                    />
                  </Col>
                  <Col sm={12} md={6} lg={4}>
                    <Occasion
                      onChange={handleChange}
                      value={formState.selectedOccasion}
                    />
                  </Col>
                </Row>
              </Container>

              {/* Conditional Rendering Length */}
              {formState.selectedType && (
                <Length
                  selectedType={formState.selectedType}
                  selectedLength={formState.selectedLength}
                  onChange={handleChange}
                />
              )}

              {/* Metal */}
              {formState.selectedType && (
                <>
                  <MetalForm
                    onChange={handleChangeMetal}
                    selectedMetalData={selectedMetalProp}
                    metalName={metalName}
                  />

                  {selectedMetalProp.selectedMetalName && (
                    <Row>
                      <Col sm={12} md={true}>
                        <Texture
                          onChange={handleChange}
                          value={formState.selectedTexture}
                        />
                      </Col>
                      {!["Rings", "Earrings"].includes(
                        formState.selectedType
                      ) && (
                        <Col sm={12} md={6}>
                          <ChainType
                            onChange={handleChange}
                            value={formState.selectedChainType}
                          />
                        </Col>
                      )}
                    </Row>
                  )}
                </>
              )}

              {/* Gemstone */}
              {["Rings", "Necklace", "Earrings"].includes(
                formState.selectedType
              ) && (
                <>
                  <h5 className="pt-1">Gemstone</h5>
                  <GemstoneForm
                    onChange={handleChangeGemstone}
                    selectedData={selectedGemstoneProp}
                    gemstoneName={gemstoneName}
                  />
                </>
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button type={"button"} variant="secondary" onClick={onHide}>
          Cancel
        </Button>{" "}
        {"     "}
        <Button
          type={"button"}
          variant="primary"
          onClick={handleSubmit}
          disable={handleDisable}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ProductNameInput = ({ value, onChange, name }) => {
  return (
    <Form.Group>
      <Form.Label>Product Name</Form.Label>
      <Form.Control
        type="text"
        size="sm"
        placeholder="Product Name"
        name={name}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

const ProductDescriptionInput = ({ value, onChange, name }) => {
  return (
    <Form.Group>
      <Form.Label>Product Description</Form.Label>
      <Form.Control
        type="input"
        as="textarea"
        size="sm"
        placeholder="Product Description"
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
      />
    </Form.Group>
  );
};

const defaultProduct = {
  name: "",
  description: "",
  imageURL: "",
  specification: {
    type: "",
    style: "",
    occasion: "",
    length: "",
    texture: "",
    chainType: "",
    gemstone: null,
    gemstoneWeight: 0.0,
    metal: null,
    metalWeight: 0.0,
  },
};

const createRequest = {
  method: "POST",
  url: `${ServerUrl}/api/products`,
  headers: {
    "content-type": "application/json",
  },
  data: null,
};

const updateRequest = {
  method: "PUT",
  url: `${ServerUrl}/api/products`,
  headers: {
    "content-type": "application/json",
  },
  data: null,
};

const gemstoneName = {
  selectedGemstoneName: "selectedGemstoneName",
  selectedGemstoneShape: "selectedGemstoneShape",
  selectedGemstoneCut: "selectedGemstoneCut",
  selectedGemstoneClarity: "selectedGemstoneClarity",
  selectedGemstoneColor: "selectedGemstoneColor",
  selectedGemstoneWeight: "selectedGemstoneWeight",
  selectedGemstone: "selectedGemstone",
};
const metalName = {
  selectedMetalName: "selectedMetalName",
  selectedMetalUnit: "selectedMetalUnit",
  selectedMetal: "selectedMetal",
  selectedMetalWeight: "selectedMetalWeight",
};

export default ProductEditor;
