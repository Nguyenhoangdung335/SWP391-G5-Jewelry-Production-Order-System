import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import ServerUrl from "../reusable/ServerUrl";
import CreateRequest from "./CreateRequest";
import { ChainType, DesignStyle, JewelryType, Length, Occasion, Texture, GemstoneForm, MetalWeight } from "./DesignOptionForms";

function OrderPage1() {
  const [showModal, setShowModal] = useState(false);
  const [productSpecId, setProductSpecId] = useState(null);

  const handleSubmit = (e, formState, selectedGemstoneProp) => {
    e.preventDefault();
    const productSpecification = {
      type: formState.selectedType,
      style: formState.selectedStyle,
      occasion: formState.selectedOccasion,
      length: formState.selectedLength,
      metal: formState.selectedMetal,
      metalWeight: formState.selectedMetalWeight,
      texture: formState.selectedTexture,
      chainType: formState.selectedChainType,
      gemstone: selectedGemstoneProp.selectedGemstone,
      gemstoneWeight: selectedGemstoneProp.selectedGemstoneWeight
    };

    axios({
      method: "POST",
      url: `${ServerUrl}/api/products/customize`,
      headers: { "Content-Type": "application/json" },
      data: productSpecification,
    })
      .then((response) => {
        setProductSpecId(response.data.responseList.productSpecification.id);
        setShowModal(true);
      })
      .catch((error) => {
        console.log("There is an error in this code" + error);
      });
  };

  const handleRequestCanceled = (e) => {
    setShowModal(false);
    if (productSpecId) {
      axios
        .delete(`${ServerUrl}/api/products/customize/${productSpecId}`)
        .then((response) => {
          console.log("Product specification removed successfully");
        })
        .catch((error) => {
          console.error("Error removing product specification:", error);
        });
    }
  };

  return (
    <Container style={{ paddingInline: "10%" }}>
      <h3 className="fw-bold" style={{ margin: "30px 0px 30px" }}>
        Create Your Dream Jewelry.
      </h3>
      <RenderSpecificationForm handleSubmit={handleSubmit} />
      <Modal show={showModal} size="lg" backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Create Request</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{width: "100%"}}>
          <CreateRequest productSpecId={productSpecId} handleCancelRequest={handleRequestCanceled} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

const RenderSpecificationForm = ({handleSubmit}) => {
  const [formState, setFormState] = useState({
    selectedType: "",
    selectedStyle: "",
    selectedOccasion: "",
    selectedLength: "",
    selectedTexture: "",
    selectedChainType: "",
    selectedMetalName: "",
    selectedMetalUnit: "",
    selectedMetal: null,
    selectedMetalWeight: "",
    selectedGemstone: null,
    selectedGemstoneWeight: "",
    metalUnits: null,
  });

  const [metalData, setMetalData] = useState([]);
  const [metalName, setMetalName] = useState([]);
  const [metalUnit, setMetalUnit] = useState({});
  const [gemstoneData, setGemstoneData] = useState({
    names: [],
    shapes: [],
    cuts: [],
    clarities: [],
    colors: [],
    minWeight: "",
    maxWeight: ""
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

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/api/gemstone/factors`);
        if (response.status === 200) {
          const data = response.data.responseList;
          setMetalData(data.metal);
          setGemstoneData({
            names: data.names,
            shapes: data.shapes,
            cuts: data.cuts,
            clarities: data.clarities,
            colors: data.colors,
            minWeight: data.minWeight,
            maxWeight: data.maxWeight,
          });
        }
      } catch (error) {
        console.error("Error fetching gemstone and metal:", error);
      }
    };

    fetchPrice();
  }, []);

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
        setFormState((prev) => ({ ...prev, selectedLength: "14", selectedTexture: "Default", selectedChainType: "Default" }));
        break;
      case "Bracelet":
        setFormState((prev) => ({ ...prev, selectedLength: "", selectedTexture: "Default", selectedChainType: "Default" }));
        break;
      case "Earrings":
        setFormState((prev) => ({ ...prev, selectedLength: "", selectedTexture: "Default", selectedChainType: "NaN" }));
        break;
      case "Anklet":
        setFormState((prev) => ({ ...prev, selectedLength: "0", selectedTexture: "Default", selectedChainType: "Default" }));
        break;
      case "Rings":
        setFormState((prev) => ({
          ...prev,
          selectedLength: "0.618",
          selectedTexture: "Default",
          selectedChainType: "NaN"
        }));
        break;
      default:
        setFormState((prev) => ({ ...prev, selectedLength: "0" }));
    }
  }, [formState.selectedType]);

  useEffect(() => {
    if (metalData.length > 0) {
      const uniqueMetalNames = [...new Set(metalData.map((item) => item.name))];
      setMetalName(uniqueMetalNames);

      const unitsMap = {};
      uniqueMetalNames.forEach((name) => {
        unitsMap[name] = metalData
          .filter((metal) => metal.name === name)
          .map((metal) => metal.unit);
      });
      setMetalUnit(unitsMap);
    }
  }, [metalData]);

  useEffect(() => {
    if (formState.selectedMetalName) {
      const units = metalUnit[formState.selectedMetalName] || [];
      setFormState((prev) => ({
        ...prev,
        selectedMetalUnit: units[0],
        selectedMetal: metalData.find(
          (metal) =>
            metal.name === formState.selectedMetalName && metal.unit === units[0]
        ),
        selectedChainType: ["Necklace", "Bracelet", "Anklet"].includes(formState.selectedType) ? "Default": "NaN",
        selectedTexture: "Default",
        metalUnits: units,
      }));
    }
  }, [formState.selectedMetalName, metalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeMetalUnit = (e) => {
    const chosenUnit = e.target.value;
    setFormState((prev) => ({
      ...prev,
      selectedMetalUnit: chosenUnit,
    }));

    if (formState.selectedMetalName) {
      const chosenMetal = metalData.find(
        (item) => {
          console.log(item);
          console.log(item.name === formState.selectedMetalName &&
            item.unit === formState.selectedMetalUnit);
          return item.name === formState.selectedMetalName &&
          item.unit === formState.selectedMetalUnit
      });
      console.log(chosenMetal);
      setFormState((prev) => ({
        ...prev,
        selectedMetal: chosenMetal,
      }));
    }
  };

  const handleChangeGemstone = useCallback((e) => {
    const { name, value } = e.target;
    if (value === "") {
      setSelectedGemstoneProp((prev) => ({ ...prev, [name]: null }));
    } else {
      setSelectedGemstoneProp((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "selectedGemstoneName" && value === "") {
      setSelectedGemstoneProp({
        selectedGemstoneName: null,
        selectedGemstoneShape: null,
        selectedGemstoneCut: null,
        selectedGemstoneClarity: null,
        selectedGemstoneColor: null,
        selectedGemstoneWeight: null,
        selectedGemstone: null,
      });
    } else if (name === "selectedGemstoneName" && value) {
      setSelectedGemstoneProp({
        selectedGemstoneName: value,
        selectedGemstoneShape: gemstoneData.shapes[0],
        selectedGemstoneCut: gemstoneData.cuts[0],
        selectedGemstoneClarity: gemstoneData.clarities[0],
        selectedGemstoneColor: gemstoneData.colors[0],
        selectedGemstoneWeight: "0.01",
        selectedGemstone: null,
      });
    }
  }, [gemstoneData]);

  const handleDisable = () => {
    const {
      selectedStyle,
      selectedOccasion,
      selectedType,
      selectedMetalName,
      selectedMetalUnit,
      selectedMetalWeight,
      selectedLength
    } = formState;

    const {
      selectedGemstoneName,
      selectedGemstone
    } = selectedGemstoneProp;

    return !(
      selectedStyle &&
      selectedOccasion &&
      selectedType &&
      selectedMetalName &&
      selectedMetalUnit &&
      selectedMetalWeight &&
      selectedMetalWeight > 0 &&
      selectedLength !== "0" &&
      selectedLength &&
      (!selectedGemstoneName || (selectedGemstoneName && selectedGemstone))
    );
  };

  return (
    <Form onSubmit={(event) => handleSubmit(event, formState, selectedGemstoneProp)} className="mb-5">
      <Container>
        <Row>
          <Col sm={12} md={6} lg={4}>
            <JewelryType onChange={handleChange} value={formState.selectedType} />
          </Col>
          <Col sm={12} md={6} lg={4}>
            <DesignStyle onChange={handleChange} value={formState.selectedStyle}/>
          </Col>
          <Col sm={12} md={6} lg={4}>
            <Occasion onChange={handleChange} value={formState.selectedOccasion} />
          </Col>
        </Row>
      </Container>

      {/* Conditional Rendering Length */}
      {formState.selectedType && (
        <Length selectedType={formState.selectedType} selectedLength={formState.selectedLength} onChange={handleChange} />
      )}

      {/* Metal */}
      {formState.selectedType && (
        <>
          {/* Metal Name */}
          <h5 className="pt-1">Material</h5>
          <Form.Group className="mb-3">
            <Form.Label>Metal*</Form.Label>
            <Form.Select
              name="selectedMetalName"
              value={formState.selectedMetalName}
              onChange={handleChange}
              size="sm"
            >
              <option value="" disabled>
                Choose one
              </option>
              {metalName.map((metal, index) => (
                <option key={index} value={metal}>
                  {metal}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {formState.selectedMetalName && (
            <>
              {/* Metal Units */}
              <Form.Group className="mb-3">
                <Form.Label>Metal Unit</Form.Label>
                <Form.Select
                  name="selectedMetalUnit"
                  value={formState.selectedMetalUnit}
                  onChange={handleChangeMetalUnit}
                  size="sm"
                >
                  {formState.metalUnits &&
                    formState.metalUnits.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <MetalWeight onChange={handleChange} selectedUnit={formState.selectedMetalUnit} value={formState.selectedMetalWeight} />

              {/* Metal Texture */}
              <Texture value={formState.selectedTexture} onChange={handleChange} />

              {/* Chain Type */}
              {!["Rings", "Earrings"].includes(formState.selectedType) && (
                <ChainType onChange={handleChange} value={formState.selectedChainType} />
              )}
            </>
          )}
        </>
      )}

      {/* Gemstone */}
      {["Rings", "Necklace", "Earrings"].includes(formState.selectedType) && (
        <>
          <h5 className="pt-1">Gemstone</h5>
          <GemstoneForm gemstoneData={gemstoneData} onChange={handleChangeGemstone} selectedData={selectedGemstoneProp} />
        </>
      )}

      <div className="d-flex justify-content-center">
        <Button type="submit" disabled={handleDisable()} style={{width: "15ch"}}>Submit</Button>
      </div>
    </Form>
  )
}

const renderMetalTable = (selectedMetalName, metalData) => {
  const metalList = metalData.find((m) => m.metal === selectedMetalName);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Metal</th>
          <th>Unit</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {metalList && metalList.length > 0 && (
          metalList.map((metal, index) => (
            <tr key={index}>
              <td>{metal.metal}</td>
              <td>{metal.unit}</td>
              <td>{metal.price}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default OrderPage1;

export {
  RenderSpecificationForm
};