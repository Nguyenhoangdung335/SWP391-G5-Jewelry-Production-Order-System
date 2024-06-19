import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ServerUrl from "../reusable/ServerUrl";

function OrderPage1() {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedGem, setSelectedGem] = useState("");
  const [selectedGemShape, setSelectedGemShape] = useState("");
  const [selectedGemWeight, setSelectedGemWeight] = useState("0");
  const [selectedLength, setSelectedLength] = useState("0");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [selectedChainType, setSelectedChainType] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    switch (selectedType) {
      case "Necklace":
        setSelectedLength("14");
        break;
      case "Bracelet":
        setSelectedLength("");
        break;
      case "Anklet":
        setSelectedLength("0");
        break;
      case "Rings":
        setSelectedLength("0.618");
        break;
      case "Earrings":
        setSelectedLength("");
        break;
      default:
        setSelectedLength("0");
    }
  }, [selectedType]);

  const productSpecification = {
    selectedType,
    selectedStyle,
    selectedOccasion,
    selectedChainType,
    selectedTexture,
    selectedGem,
    selectedGemShape,
    selectedGemWeight,
    selectedMetal,
    selectedLength,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedLength);
    //FetchData here

    axios({
      method: "POST",
      url: `${ServerUrl}/api/product/customize`,
      headers: { "Content-Type": "application/json" },
      data: productSpecification,
    })
      .then((response) => {
        // Create a components for quotation
      })
      .catch((error) => {
        console.log("There is an error in this code" + error);
      });
  };

  const handleDisable = () => {
    let disableStatus = true;

    if (
      selectedStyle !== "" &&
      selectedOccasion !== "" &&
      selectedType !== "" &&
      selectedMetal !== "" &&
      selectedLength !== "0" &&
      selectedLength !== "" &&
      selectedGem === ""
    ) {
      disableStatus = false;
    } else if (selectedGem !== "" && selectedGemWeight !== "0") {
      disableStatus = false;
    } else {
      disableStatus = true;
    }

    return disableStatus;
  };

  const handleGemValue = (e) => {
    setSelectedGem(e.target.value);

    if (e.target.value === "") {
      setSelectedGemWeight("0");
    }
  };

  return (
    <Container>
      <h3 className="fw-bold" style={{ margin: "30px 0px 30px" }}>
        Create Your Dream Jewelry.
      </h3>
      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group className="mb-3">
          <Form.Label>Design style*</Form.Label>
          <Form.Select
            value={selectedStyle}
            size="sm"
            onChange={(e) => setSelectedStyle(e.target.value)}
          >
            <option value="" disabled>
              Choose one
            </option>
            <option value="historic">Historic</option>
            <option value="georgian">Georgian</option>
            <option value="victorian">Victorian</option>
            <option value="edwardian">Edwardian</option>
            <option value="art nouveau">Art Nouveau</option>
            <option value="art deco">Art Deco</option>
            <option value="retro">Retro</option>
            <option value="modernist">Modernist</option>
            <option value="minimalistic">Minimalistic</option>
            <option value="contemporary">Contemporary</option>
            <option value="cultural">Cultural</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Occasion*</Form.Label>
          <Form.Select
            value={selectedOccasion}
            size="sm"
            onChange={(e) => setSelectedOccasion(e.target.value)}
          >
            <option value="" disabled>
              Choose one
            </option>
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

        <Form.Group className="mb-3">
          <Form.Label>Jewelry type*</Form.Label>
          <Form.Select
            size="sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="" disabled>
              Choose one
            </option>
            <option value="Rings">Rings</option>
            <option value="Necklace">Necklace</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Anklet">Anklet</option>
          </Form.Select>
        </Form.Group>
        {selectedType !== "" && (
          <>
            <Form.Group className="mb-3">
              {selectedType === "Necklace" && (
                <>
                  <Form.Label>Necklace Length: {selectedLength}"</Form.Label>
                  <Form.Range
                    step="1"
                    min="14"
                    max="42"
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                  />
                </>
              )}

              {selectedType === "Bracelet" && (
                <>
                  <Form.Label>Bracelet Size</Form.Label>
                  <Form.Select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
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
                    X-Small: 4.76-5.25". | Small: 5.26-5.75". | Medium:
                    5.76-6.25". | Large: 6.26-6.75".{<br />}X-Large: 6.76-7.25".
                    | XX-Large: 7.26–7.75". | XXX-Large: 7.76–8.25".{" "}
                  </Form.Text>
                </>
              )}

              {selectedType === "Anklet" && (
                <>
                  <Form.Label>Anklet Size: {selectedLength}"</Form.Label>
                  <Form.Range
                    step="1"
                    min="0"
                    max="10"
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                  />
                </>
              )}

              {selectedType === "Rings" && (
                <>
                  <Form.Label>
                    Rings inside diameters: {selectedLength}"
                  </Form.Label>
                  <Form.Range
                    step="0.001"
                    min="0.618"
                    max="0.846"
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                  />
                </>
              )}

              {selectedType === "Earrings" && (
                <>
                  <Form.Label>Earrings size</Form.Label>
                  <Form.Select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
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
          </>
        )}

        {/* Material section */}

        {selectedType !== "" && (
          <>
            <h5 className="pt-1">Material</h5>

            <Form.Group className="mb-3">
              <Form.Label>Metal*</Form.Label>
              <Form.Select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                size="sm"
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
                <option value="Titanium">Titanium</option>
                <option value="Copper">Copper</option>
                <option value="Zinc">Zinc</option>
              </Form.Select>
            </Form.Group>
          </>
        )}

        {selectedMetal !== "" && (
          <Form.Group className="mb-3">
            <Form.Label>Texture</Form.Label>
            <Form.Select
              value={selectedTexture}
              onChange={(e) => setSelectedTexture(e.target.value)}
              size="sm"
            >
              <option value="Default">Default</option>
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
        )}

        {selectedType !== "" &&
          selectedType !== "Earrings" &&
          selectedMetal !== "" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Chain Type</Form.Label>
                <Form.Select
                  value={selectedChainType}
                  onChange={(e) => setSelectedChainType(e.target.value)}
                  size="sm"
                >
                  <option value="Default">Default</option>
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
            </>
          )}

        {(selectedType === "Rings" ||
          selectedType === "Necklace" ||
          selectedType === "Earrings") && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Gemstone</Form.Label>
              <Form.Select
                value={selectedGem}
                onChange={handleGemValue}
                size="sm"
              >
                <option value="">None</option>
                <option value="Diamond">Diamond</option>
                <option value="Emerald">Emerald</option>
                <option value="Sapphire">Sapphire</option>
                <option value="Ruby">Ruby</option>
              </Form.Select>
            </Form.Group>

            {selectedGem !== "" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Gemstone</Form.Label>
                  <Form.Select
                    value={selectedGemShape}
                    onChange={(e) => setSelectedGemShape(e.target.value)}
                    size="sm"
                  >
                    <option value="Round">Round</option>
                    <option value="Radiant">Radiant</option>
                    <option value="Square Radiant">Square Radiant</option>
                    <option value="Pear">Pear</option>
                    <option value="Marquise">Marquise</option>
                    <option value="Briolette">Briolette</option>
                    <option value="Asscher">Asscher</option>
                    <option value="Baguette">Baguette</option>
                    <option value="Princess">Princess</option>
                    <option value="Cushion">Cushion</option>
                    <option value="Square Cushion">Square Cushion</option>
                    <option value="Oval">Oval</option>
                    <option value="Kite">Kite</option>
                    <option value="Heart">Heart</option>
                    <option value="Trillion">Trillion</option>
                    <option value="Half Moon">Half-Moon</option>
                    <option value="Trapezoid">Trapezoid</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Gemstone Weight: {selectedGemWeight} carats
                  </Form.Label>
                  <Form.Range
                    step="0.25"
                    min="0"
                    max="10"
                    value={selectedGemWeight}
                    onChange={(e) => setSelectedGemWeight(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </>
        )}

        <Button
          type="submit"
          disabled={handleDisable()}
          className="fw-bold"
          style={{ width: "100px" }}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}
export default OrderPage1;
