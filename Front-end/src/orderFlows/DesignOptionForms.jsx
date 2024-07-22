import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const JewelryType = ({ value, onChange }) => {
  const [typeList, setTypeList] = useState([]);

  useEffect(() => {
    // Fetch type list from server
    setTypeList([
        {value: "Rings", name: "Rings"},
        {value: "Necklace", name: "Necklace"},
        {value: "Earrings", name: "Earrings"},
        {value: "Bracelet", name: "Bracelet"},
        {value: "Anklet", name: "Anklet"},
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Jewelry Type*</Form.Label>
      <Form.Select name="selectedType" value={value} size="sm" onChange={onChange}>
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
    // Fetch style list from server
    setStyleList([
        {value:"Historic", name: "Historic",},
        {value:"Georgian", name:"Georgian",},
        {value:"Victorian", name:"Victorian"},
        {value:"Edwardian", name:"Edwardian"},
        {value:"Art nouveau", name: "Art Nouveau"},
        {value:"Art deco", name: "Art Deco"},
        {value:"Retro", name: "Retro"},
        {value:"Modernist", name: "Modernist"},
        {value:"Minimalistic", name: "Minimalistic"},
        {value:"Contemporary", name: "Contemporary"},
        {value:"Cultural", name:"Cultural"},
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Design Style*</Form.Label>
      <Form.Select name="selectedDesignStyle" value={value} size="sm" onChange={onChange}>
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
        {value: "Engagement", name: "Engagement"},
        {value: "Wedding", name: "Wedding"},
        {value: "Anniversaries", name: "Anniversaries"},
        {value: "Birthdays", name: "Birthdays"},
        {value: "Formal Events", name: "Formal Events"},
        {value: "Working days", name: "Working days"},
        {value: "Dinner date", name: "Dinner date"},
        {value: "Holiday", name: "Holiday"},
        {value: "Informal gathering", name: "Informal gathering"},
        {value: "Everyday uses", name: "Everyday uses"},
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Occasion</Form.Label>
      <Form.Select name="selectedOccasion" value={value} size="sm" onChange={onChange}>
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

const Length = ({ selectedType, selectedLength, handleChange }) => {
    return (
      <>
        {selectedType && (
          <Form.Group className="mb-3">
            {selectedType === "Necklace" && (
              <>
                <Form.Label>
                  Necklace Length: {selectedLength}"
                </Form.Label>
                <Form.Range
                  name="selectedLength"
                  step="1"
                  min="14"
                  max="42"
                  value={selectedLength}
                  onChange={handleChange}
                />
              </>
            )}
            {selectedType === "Bracelet" && (
              <>
                <Form.Label>Bracelet Size</Form.Label>
                <Form.Select
                  name="selectedLength"
                  value={selectedLength}
                  onChange={handleChange}
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
                  | Large: 6.26-6.75".<br />
                  X-Large: 6.76-7.25". | XX-Large: 7.26–7.75". | XXX-Large: 7.76–8.25".
                </Form.Text>
              </>
            )}
            {selectedType === "Anklet" && (
              <>
                <Form.Label>
                  Anklet Size: {selectedLength}"
                </Form.Label>
                <Form.Range
                  name="selectedLength"
                  step="1"
                  min="0"
                  max="10"
                  value={selectedLength}
                  onChange={handleChange}
                />
              </>
            )}
            {selectedType === "Rings" && (
              <>
                <Form.Label>
                  Rings inside diameters: {selectedLength}"
                </Form.Label>
                <Form.Range
                  name="selectedLength"
                  step="0.001"
                  min="0.618"
                  max="0.846"
                  value={selectedLength}
                  onChange={handleChange}
                />
              </>
            )}
            {selectedType === "Earrings" && (
              <>
                <Form.Label>Earrings size</Form.Label>
                <Form.Select
                  name="selectedLength"
                  value={selectedLength}
                  onChange={handleChange}
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
                  Small: 0.393-1.181". | Medium: 1.575-1.968". | Large: 2.559-3.149". | X-Large: Over 3.149".
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
        { value: "Wheat", name: "Wheat" }
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Chain Type</Form.Label>
      <Form.Select name="selectedChainType" value={value} size="sm" onChange={onChange}>
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
        { value: "Florentine", name: "Florentine" }
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Texture</Form.Label>
      <Form.Select name="selectedTexture" value={value} size="sm" onChange={onChange}>
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
      { name: "Platinum", value: "Platinum" }
    ]);
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Metal Type*</Form.Label>
      <Form.Select name="selectedMetalName" value={value} size="sm" onChange={onChange}>
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
    Platinum: ["Gram", "Ounce"]
  });

  const units = metalUnit[selectedMetalName] || [];

  return (
    <Form.Group className="mb-3">
      <Form.Label>Metal Unit*</Form.Label>
      <Form.Select name="selectedMetalUnit" value={value} size="sm" onChange={onChange} disabled={!units.length}>
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

const GemstoneType = ({ value, onChange, gemstoneData }) => (
  <Form.Group className="mb-3">
    <Form.Label>Gemstone Type*</Form.Label>
    <Form.Select name="selectedGemstoneTypeId" value={value} size="sm" onChange={onChange}>
      <option value="" disabled>
        Choose one
      </option>
      {gemstoneData.map((gemstone) => (
        <option key={gemstone.id} value={gemstone.id}>
          {gemstone.name}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);

const GemstoneShape = ({ value, onChange, gemstoneData }) => {
  const selectedGemstoneType = gemstoneData.find((gem) => gem.id === value);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Shape*</Form.Label>
      <Form.Select name="selectedGemstoneShape" value={value} size="sm" onChange={onChange} disabled={!selectedGemstoneType}>
        <option value="" disabled>
          Choose one
        </option>
        {selectedGemstoneType?.shapes.map((shape) => (
          <option key={shape} value={shape}>
            {shape}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneCut = ({ value, onChange, gemstoneData }) => {
  const selectedGemstoneType = gemstoneData.find((gem) => gem.id === value);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Cut*</Form.Label>
      <Form.Select name="selectedGemstoneCut" value={value} size="sm" onChange={onChange} disabled={!selectedGemstoneType}>
        <option value="" disabled>
          Choose one
        </option>
        {selectedGemstoneType?.cuts.map((cut) => (
          <option key={cut} value={cut}>
            {cut}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneClarity = ({ value, onChange, gemstoneData }) => {
  const selectedGemstoneType = gemstoneData.find((gem) => gem.id === value);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Clarity*</Form.Label>
      <Form.Select name="selectedGemstoneClarity" value={value} size="sm" onChange={onChange} disabled={!selectedGemstoneType}>
        <option value="" disabled>
          Choose one
        </option>
        {selectedGemstoneType?.clarities.map((clarity) => (
          <option key={clarity} value={clarity}>
            {clarity}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneColor = ({ value, onChange, gemstoneData }) => {
  const selectedGemstoneType = gemstoneData.find((gem) => gem.id === value);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Gemstone Color*</Form.Label>
      <Form.Select name="selectedGemstoneColor" value={value} size="sm" onChange={onChange} disabled={!selectedGemstoneType}>
        <option value="" disabled>
          Choose one
        </option>
        {selectedGemstoneType?.colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const GemstoneWeight = ({ value, onChange }) => (
  <Form.Group className="mb-3">
    <Form.Label>Gemstone Weight (Carat)*</Form.Label>
    <Form.Control
      type="number"
      name="selectedGemstoneWeight"
      value={value}
      size="sm"
      placeholder="Weight"
      onChange={onChange}
      min="0.05"
      max="5"
      step="0.01"
    />
  </Form.Group>
);

export {
  JewelryType,
  DesignStyle,
  Occasion,
  Length,
  ChainType,
  Texture,
  MetalType,
  MetalUnit,
  GemstoneType,
  GemstoneShape,
  GemstoneCut,
  GemstoneClarity,
  GemstoneColor,
  GemstoneWeight
};
