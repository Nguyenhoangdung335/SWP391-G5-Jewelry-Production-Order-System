import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  Table,
  Image,
} from "react-bootstrap";
import DoubleRangeSlider from "../reusable/DoubleRangeSlider/DoubleRangeSlider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import "./../App.css";

const JewelryType = ({ value, onChange }) => {
  const [typeList, setTypeList] = useState([]);

  useEffect(() => {
    // Fetch type list from server
    setTypeList([
      { value: "Rings", name: "Rings" },
      { value: "Necklace", name: "Necklace" },
      { value: "Earrings", name: "Earrings" },
      { value: "Bracelet", name: "Bracelet" },
      { value: "Anklet", name: "Anklet" },
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Jewelry Type*</Form.Label>
      <Form.Select
        name="selectedType"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="" disabled>
          Choose one
        </option>
        {typeList.map((type, index) => (
          <option key={index} value={type.value}>
            {type.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const DesignStyle = ({ value, onChange }) => {
  const [styleList, setStyleList] = useState([]);

  useEffect(() => {
    setStyleList([
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
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Design Style*</Form.Label>
      <Form.Select
        name="selectedStyle"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="" disabled>
          Choose one
        </option>
        {styleList.map((style, index) => (
          <option key={index} value={style.value}>
            {style.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const Occasion = ({ value, onChange }) => {
  const [occasionList, setOccasionList] = useState([]);

  useEffect(() => {
    // Fetch occasion list from server
    setOccasionList([
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
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Occasion</Form.Label>
      <Form.Select
        name="selectedOccasion"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="" disabled>
          Choose one
        </option>
        {occasionList.map((occasion, index) => (
          <option key={index} value={occasion.value}>
            {occasion.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const Length = ({ selectedType, selectedLength, onChange }) => {
  return (
    <>
      {selectedType && (
        <Form.Group className="mb-3">
          {selectedType === "Necklace" && (
            <>
              <Form.Label>Necklace Length: {selectedLength}"</Form.Label>
              <Form.Range
                name="selectedLength"
                step="1"
                min="14"
                max="42"
                value={selectedLength}
                onChange={onChange}
              />
            </>
          )}
          {selectedType === "Bracelet" && (
            <>
              <Form.Label>Bracelet Size</Form.Label>
              <Form.Select
                name="selectedLength"
                value={selectedLength}
                onChange={onChange}
                size="sm"
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option value="XS">X-Small</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">X-Large</option>
                <option value="XXL">XX-Large</option>
                <option value="XXXL">XXX-Large</option>
              </Form.Select>
              <Form.Text muted>
                X-Small: 4.76-5.25". | Small: 5.26-5.75". | Medium: 5.76-6.25".
                | Large: 6.26-6.75".
                <br />
                X-Large: 6.76-7.25". | XX-Large: 7.26–7.75". | XXX-Large:
                7.76–8.25".
              </Form.Text>
            </>
          )}
          {selectedType === "Anklet" && (
            <>
              <Form.Label>Anklet Size: {selectedLength}"</Form.Label>
              <Form.Range
                name="selectedLength"
                step="1"
                min="0"
                max="10"
                value={selectedLength}
                onChange={onChange}
              />
            </>
          )}
          {selectedType === "Rings" && (
            <>
              <Form.Label>Rings inside diameters: {selectedLength}"</Form.Label>
              <Form.Range
                name="selectedLength"
                step="0.001"
                min="0.618"
                max="0.846"
                value={selectedLength}
                onChange={onChange}
              />
            </>
          )}
          {selectedType === "Earrings" && (
            <>
              <Form.Label>Earrings size</Form.Label>
              <Form.Select
                name="selectedLength"
                value={selectedLength}
                onChange={onChange}
                size="sm"
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">X-Large</option>
              </Form.Select>
              <Form.Text muted>
                Small: 0.393-1.181". | Medium: 1.575-1.968". | Large:
                2.559-3.149". | X-Large: Over 3.149".
              </Form.Text>
            </>
          )}
        </Form.Group>
      )}
    </>
  );
};

const ChainType = ({ value, onChange }) => {
  const [chainTypeList, setChainTypeList] = useState([]);

  useEffect(() => {
    // Fetch chain type list from server
    setChainTypeList([
      { value: "Default", name: "Default" },
      { value: "Bead", name: "Bead" },
      { value: "Box", name: "Box" },
      { value: "Byzantine", name: "Byzantine" },
      { value: "Cable", name: "Cable" },
      { value: "Solid Cable", name: "Solid Cable" },
      { value: "Curb", name: "Curb" },
      { value: "Figaro", name: "Figaro" },
      { value: "Mesh", name: "Mesh" },
      { value: "Omega", name: "Omega" },
      { value: "Palma", name: "Palma" },
      { value: "Popcorn", name: "Popcorn" },
      { value: "Rolo", name: "Rolo" },
      { value: "Rope", name: "Rope" },
      { value: "San Marco", name: "San Marco" },
      { value: "Singapore", name: "Singapore" },
      { value: "Snake", name: "Snake" },
      { value: "Wheat", name: "Wheat" },
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Chain Type</Form.Label>
      <Form.Select
        name="selectedChainType"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="" disabled>
          Choose one
        </option>
        {chainTypeList.map((chainType, index) => (
          <option key={index} value={chainType.value}>
            {chainType.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const Texture = ({ value, onChange }) => {
  const [textureList, setTextureList] = useState([]);

  useEffect(() => {
    // Fetch texture list from server
    setTextureList([
      { value: "Default", name: "Default" },
      { value: "Polished", name: "Polished" },
      { value: "Satin", name: "Satin" },
      { value: "Brushed", name: "Brushed" },
      { value: "Wire Brushed", name: "Wire Brushed" },
      { value: "Sand Blasted", name: "Sand Blasted" },
      { value: "Bead Blasted", name: "Bead Blasted" },
      { value: "Stone", name: "Stone" },
      { value: "Hammered", name: "Hammered" },
      { value: "Florentine", name: "Florentine" },
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Texture</Form.Label>
      <Form.Select
        name="selectedTexture"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="" disabled>
          Choose one
        </option>
        {textureList.map((texture, index) => (
          <option key={index} value={texture.value}>
            {texture.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const MetalType = ({ value, onChange }) => {
  const [metalName, setMetalName] = useState([]);

  useEffect(() => {
    // Fetch metal name list from server
    setMetalName([
      { name: "Gold", value: "Gold" },
      { name: "Silver", value: "Silver" },
      { name: "Platinum", value: "Platinum" },
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Metal Type*</Form.Label>
      <Form.Select
        name="selectedMetalName"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="" disabled>
          Choose one
        </option>
        {metalName.map((metal, index) => (
          <option key={index} value={metal.value}>
            {metal.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const MetalUnit = ({ value, onChange, selectedMetalName }) => {
  const [metalUnit, setMetalUnit] = useState({
    Gold: ["Gram", "Ounce"],
    Silver: ["Gram", "Ounce"],
    Platinum: ["Gram", "Ounce"],
  });

  const units = metalUnit[selectedMetalName] || [];

  return (
    <Form.Group className="mb-3">
      <Form.Label>Metal Unit*</Form.Label>
      <Form.Select
        name="selectedMetalUnit"
        value={value}
        size="sm"
        onChange={onChange}
        disabled={!units.length}
      >
        <option value="" disabled>
          Choose one
        </option>
        {units.map((unit, index) => (
          <option key={index} value={unit}>
            {unit}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const MetalWeight = ({ value = 0, onChange, minVal = 1, maxVal = 1000, step = 1, selectedUnit}) => {
  const [tempValue, setTempValue] = useState((value < minVal)? minVal: value);
  const [range, setRange] = useState({
    min: minVal,
    max: maxVal,
    step: step,
  });
  const [convertRate, setConvertRate] = useState()
  const handleMouseUp = (e) => {
    onChange({ target: { name: e.target.name, value: tempValue } });
  };

  const handleTouchEnd = (e) => {
    onChange({ target: { name: e.target.name, value: tempValue } });
  };

  const handleChange = (event) => {
    setTempValue(event.target.value);
  };
  if (selectedUnit?.toLowerCase() === "kilogram") {
    maxVal = 10;
    step = 0.001;
  }

  useEffect(() => {
    switch (selectedUnit?.toLowerCase()) {
      case "kilogram":
        setConvertRate(1000);
        setRange({ min: 0.01, max: 10, step: 0.01, });
        break;
      case "ounce":
        setConvertRate(28.35);
        setRange({ min: 0.1, max: 50, step: 0.1, });
        break;
      case "tola":
          setConvertRate(11.6638);
          setRange({ min: 0.1, max: 50, step: 0.1, });
          break;
      default:
        setRange({ min: minVal, max: maxVal, step: step, });
          setConvertRate(1);
    }
  }, [selectedUnit, maxVal, minVal, step]);

  const formatUnit = (num) => {
    return Number(num).toLocaleString("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Form.Group className="mb-3 position-relative">
      <Form.Label className="d-block">Metal Weight*: {formatUnit(tempValue)} {selectedUnit} {!selectedUnit?.toLowerCase().includes("gram")? "(" + formatUnit(tempValue*convertRate) + " gram)" : ""}</Form.Label>
      <div className="d-flex justify-content-between align-items-center">
        <span>{minVal}</span>
        <Form.Range
          style={{ display: "inline-block", width: "90%", margin: "0 auto" }}
          name="selectedMetalWeight"
          value={tempValue}
          size="sm"
          placeholder="Weight"
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          min={minVal}
          max={maxVal}
          step={step}
        />
        <span>{maxVal}</span>
      </div>
    </Form.Group>
  );
};

const GemstoneWeightRange = ({ minWeight, maxWeight, handleWeightChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Weight Range</Form.Label>
      <div className="d-flex justify-content-center align-items-center">
        <div style={{ fontSize: ".9rem", marginInline: "0.5rem" }}>
          {minWeight / 100}
        </div>
        <DoubleRangeSlider min={1} max={1100} onChange={handleWeightChange} />
        <div style={{ fontSize: ".9rem", marginInline: "0.5rem" }}>
          {maxWeight / 100}
        </div>
      </div>
    </Form.Group>
  );
};

const GemstoneName = ({ value, onChange, gemstoneName }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone</Form.Label>
      <Form.Select
        name="selectedGemstoneName"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="">None</option>
        {gemstoneName.map((gemstone, index) => (
          <option key={index} value={gemstone}>
            {gemstone}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneShape = ({ value, onChange, gemstoneShape }) => {
  const [hoveredShape, setHoveredShape] = useState(null);
  const images = importAllImages(
    require.context("../assets/GemstoneShape", false, /\.png$/)
  );

  const handleMouseOver = (shape) => {
    setHoveredShape(shape);
  };

  const handleMouseLeave = () => {
    setHoveredShape(null);
  };

  const handleChange = (event) => {
    onChange(event);
    setHoveredShape(event.target.value);
  };

  const renderGemstoneShapePreview = (shape) => {
    const imageName = shape.charAt(0) + shape.slice(1).toLowerCase();
    const imageUrl = images[imageName];
    return imageUrl ? (
      <Image src={imageUrl} thumbnail />
    ) : (
      <span>Image not found</span>
    );
  };

  return (
    <Form.Group className="mb-3 position-relative">
      <Form.Label>Gemstone Shape</Form.Label>
      <div style={{ position: "relative" }}>
        <Form.Select
          name="selectedGemstoneShape"
          defaultValue=""
          value={value}
          size="sm"
          onChange={handleChange}
        >
          <option value="">All</option>
          {gemstoneShape?.map((shape) => (
            <option
              key={shape}
              value={shape}
              onMouseOver={() => handleMouseOver(shape)}
              onMouseLeave={handleMouseLeave}
            >
              {shape}
            </option>
          ))}
        </Form.Select>
        {hoveredShape && (
          <div
            style={{
              position: "absolute",
              top: "-100%",
              right: "105%",
              marginLeft: "10px",
              zIndex: "1",
              width: "100px",
              height: "auto",
            }}
          >
            {renderGemstoneShapePreview(hoveredShape)}
          </div>
        )}
      </div>
    </Form.Group>
  );
};

const GemstoneCut = ({ value, onChange, gemstoneCut }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Cut*</Form.Label>
      <Form.Select
        name="selectedGemstoneCut"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="">All</option>
        {gemstoneCut.map((cut) => (
          <option key={cut} value={cut}>
            {cut}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneClarity = ({ value, onChange, gemstoneClarity }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Clarity*</Form.Label>
      <Form.Select
        name="selectedGemstoneClarity"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="">All</option>
        {gemstoneClarity.map((clarity) => (
          <option key={clarity} value={clarity}>
            {clarity}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneColor = ({ value, onChange, gemstoneColor }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Color*</Form.Label>
      <Form.Select
        name="selectedGemstoneColor"
        value={value}
        size="sm"
        onChange={onChange}
      >
        <option value="">All</option>
        {gemstoneColor.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneWeight = ({ value: gemstoneWeight, onChange, minVal = 0.05, maxVal = 5, step = 0.01 }) => {
  const [tempValue, setTempValue] = useState(gemstoneWeight || 0.05);
  const handleMouseUp = (e) => {
    onChange({ target: { name: e.target.name, value: tempValue } });
  };

  const handleTouchEnd = (e) => {
    onChange({ target: { name: e.target.name, value: tempValue } });
  };

  const handleChange = (event) => {
    setTempValue(event.target.value);
  };

  return (
    <Form.Group className="mb-3 position-relative">
      <Form.Label className="d-block">
        Gemstone Weight*: {gemstoneWeight} Carat
      </Form.Label>
      <div className="d-flex justify-content-between align-items-center">
        <span>{minVal}</span>
        <Form.Range
          style={{ display: "inline-block", width: "90%", margin: "0 auto" }}
          name="selectedGemstoneWeight"
          value={tempValue}
          size="sm"
          placeholder="Weight"
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          min={minVal}
          max={maxVal}
          step={step}
        />
        <span>{maxVal}</span>
      </div>
    </Form.Group>
  );
};

const GemstoneForm = ({ gemstoneData, onChange, selectedData }) => {
  const handleSelectGemstone = useCallback(
    (data) => {
      console.log(data);
      onChange({ target: { name: "selectedGemstone", value: data } });
    },
    [onChange]
  );

  return (
    <Container>
      <Row>
        <Col sm={12}>
          <GemstoneName
            gemstoneName={gemstoneData.names}
            onChange={onChange}
            value={selectedData.selectedGemstoneName}
          />
        </Col>
        {selectedData.selectedGemstoneName && (
          <>
            <Col sm={12} md={6}>
              <GemstoneShape
                gemstoneShape={gemstoneData.shapes}
                onChange={onChange}
                value={selectedData.selectedGemstoneShape}
              />
            </Col>
            <Col sm={12} md={6}>
              <GemstoneCut
                gemstoneCut={gemstoneData.cuts}
                onChange={onChange}
                value={selectedData.selectedGemstoneCut}
              />
            </Col>
            <Col sm={12} md={6}>
              <GemstoneClarity
                gemstoneClarity={gemstoneData.clarities}
                onChange={onChange}
                value={selectedData.selectedGemstoneClarity}
              />
            </Col>
            <Col sm={12} md={6}>
              <GemstoneColor
                gemstoneColor={gemstoneData.colors}
                onChange={onChange}
                value={selectedData.selectedGemstoneColor}
              />
            </Col>
            <Col sm={12}>
              <GemstoneWeight
                onChange={onChange}
                value={selectedData.selectedGemstoneWeight}
                minVal={gemstoneData.minWeight}
                maxVal={gemstoneData.maxWeight}
                step={0.01}
              />
            </Col>
          </>
        )}
      </Row>
      <Row>
        <RenderGemstoneTable
          selectedGemstoneProp={selectedData}
          handleSelectGemstone={handleSelectGemstone}
        />
      </Row>
    </Container>
  );
};

function RenderGemstoneTable({ selectedGemstoneProp, handleSelectGemstone }) {
  const [gemstoneData, setGemstoneData] = useState([]);
  const [selectedGemstone, setSelectedGemstone] = useState(selectedGemstoneProp.selectedGemstone);
  const isQualifiedRender = selectedGemstoneProp.selectedGemstoneName;

  useEffect(() => {
    if (isQualifiedRender) {
      const requestBody = {
        name: selectedGemstoneProp.selectedGemstoneName || null,
        shape: selectedGemstoneProp.selectedGemstoneShape || null,
        clarity: selectedGemstoneProp.selectedGemstoneClarity || null,
        color: selectedGemstoneProp.selectedGemstoneColor || null,
        weight: selectedGemstoneProp.selectedGemstoneWeight || null,
        cut: selectedGemstoneProp.selectedGemstoneCut || null,
      };

      const request = {
        method: "POST",
        url: `${ServerUrl}/api/gemstone/search`,
        headers: {
          "content-type": "application/json",
        },
        data: requestBody,
      };

      const fetchGemstone = async () => {
        const response = await axios.request(request);
        if (response.status === 200) {
          const gemstone = response.data.responseList.gemstone;
          setGemstoneData(gemstone);
          handleSelectGemstone(gemstone[0]);
        }
      };

      fetchGemstone();
    }
  }, [
    isQualifiedRender,
    selectedGemstoneProp.selectedGemstoneName,
    selectedGemstoneProp.selectedGemstoneShape,
    selectedGemstoneProp.selectedGemstoneColor,
    selectedGemstoneProp.selectedGemstoneClarity,
    selectedGemstoneProp.selectedGemstoneCut,
    selectedGemstoneProp.selectedGemstoneWeight,
    handleSelectGemstone,
  ]);

  const handleRowClick = (gemstone) => {
    setSelectedGemstone(gemstone);
    handleSelectGemstone(gemstone);
  };

  return (
    isQualifiedRender && (
      <Table striped bordered hover className="table-fixed">
        <thead>
          <tr>
            <th>Gemstone</th>
            <th>Shape</th>
            <th>Cut</th>
            <th>Clarity</th>
            <th>Color</th>
            <th>Weight</th>
            <th>Price Per Carat</th>
          </tr>
        </thead>
        <tbody>
          {gemstoneData &&
            gemstoneData.length > 0 &&
            gemstoneData
              .sort((a, b) =>
                a === selectedGemstone ? -1 : b === selectedGemstone ? 1 : 0
              )
              .map((gemstone) => (
                <tr
                  key={gemstone.id}
                  onClick={() => handleRowClick(gemstone)}
                  className={
                    gemstone === selectedGemstone
                      ? "selected-row"
                      : "unselected-row"
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    {gemstone === selectedGemstone ? "✔️ " : ""}
                    {gemstone.name}
                  </td>
                  <td>{gemstone.shape}</td>
                  <td>{gemstone.cut}</td>
                  <td>{gemstone.clarity}</td>
                  <td>{gemstone.color}</td>
                  <td>
                    {gemstone.caratWeightFrom}-{gemstone.caratWeightTo}
                  </td>
                  <td>{formatPrice(gemstone.pricePerCaratInHundred * 100)}</td>
                </tr>
              ))}
          {(!gemstoneData || (gemstoneData && gemstoneData.length === 0)) && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                There is no entries
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    )
  );
}

const formatPrice = (price) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

function importAllImages(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace('./', '').replace('.png', '')] = r(item);
  });
  return images;
}

export {
  JewelryType,
  DesignStyle,
  Occasion,
  Length,
  ChainType,
  Texture,
  MetalType,
  MetalUnit,
  MetalWeight,
  GemstoneName,
  GemstoneShape,
  GemstoneCut,
  GemstoneClarity,
  GemstoneColor,
  GemstoneWeightRange,
  GemstoneWeight,
  GemstoneForm,
};
