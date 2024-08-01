import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import "./GemstoneList.css";

const GemstoneList = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clarityFilter, setClarityFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [cutFilter, setCutFilter] = useState("");
  const [caratWeight, setCaratWeight] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchGemstones = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/api/gemstone?page=0&size=174&sortBy=id`
        );
        if (response.data.status === "OK") {
          setGemstones(response.data.responseList.gemstone);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gemstones:", error);
        setLoading(false);
      }
    };

    fetchGemstones();
  }, []);

  const handleClarityChange = (e) => setClarityFilter(e.target.value);
  const handleColorChange = (e) => setColorFilter(e.target.value);
  const handleCutChange = (e) => setCutFilter(e.target.value);
  const handleCaratWeightChange = (event) => {
    setCaratWeight(Number(event.target.value));
  };
  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const filteredGemstones = gemstones.filter((gemstone) => {
    return (
      (!clarityFilter || gemstone.clarity === clarityFilter) &&
      (!colorFilter || gemstone.color === colorFilter) &&
      (caratWeight === 0 ||
        (gemstone.caratWeightFrom <= caratWeight &&
          gemstone.caratWeightTo >= caratWeight)) &&
      (price === 0 || gemstone.pricePerCaratInHundred === price) &&
      (!cutFilter || gemstone.cut === cutFilter)
    );
  });

  return (
    <Container
      className="pt-5 pb-4 w-75 d-flex flex-column"
      style={{ height: "91vh" }}
    >
      <Row className="text-center pb-3">
        <Col>
          <h2 className="display-4">Gemstone List</h2>
        </Col>
      </Row>
      <Row className="pb-3">
        <Col md={4}>
          <div className="filter-group">
            <label>Clarity:</label>
            <select className="form-control" onChange={handleClarityChange}>
              <option value="">All</option>
              <option value="IF_VVS">IF_VVS</option>
              <option value="VS1">VS1</option>
              <option value="VS2">VS2</option>
              <option value="SI1">SI1</option>
              <option value="SI2">SI2</option>
              <option value="S3">S3</option>
              <option value="I1">I1</option>
              <option value="I2">I2</option>
              <option value="I3">I3</option>
            </select>
          </div>
        </Col>
        <Col md={4}>
          <div className="filter-group">
            <label>Color:</label>
            <select className="form-control" onChange={handleColorChange}>
              <option value="">All</option>
              <option value="D">D</option>
              <option value="G">G</option>
              <option value="I">I</option>
              <option value="K">K</option>
            </select>
          </div>
        </Col>
        <Col md={4}>
          <div className="filter-group">
            <label>Cut:</label>
            <select className="form-control" onChange={handleCutChange}>
              <option value="">All</option>
              <option value="FAIR">FAIR</option>
              <option value="GOOD">GOOD</option>
              <option value="VERY_GOOD">VERY_GOOD</option>
              <option value="EXCELLENT">EXCELLENT</option>
            </select>
          </div>
        </Col>
      </Row>
      <Row className="pb-3">
        <Col md={4}>
          <div className="filter-group carat-weight-filter">
            <label>Carat Weight:</label>
            <div className="slider-container d-flex align-items-center">
              <input
                type="range"
                min="0"
                max="0.69"
                step="0.01"
                value={caratWeight}
                onChange={handleCaratWeightChange}
                className="custom-slider"
              />
              <span className="ml-3 font-weight-bold">
                {caratWeight.toFixed(2)}
              </span>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="filter-group">
            <label>Price Per Carat:</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={price}
              onChange={handlePriceChange}
              className="form-control"
              style={{ width: "90px" }}
            />
          </div>
        </Col>
      </Row>
      <div style={{ height: "500px", overflowY: "scroll" }}>
        <Table bordered hover responsive className="table-striped text-center">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Shape</th>
              <th>Cut</th>
              <th>Clarity</th>
              <th>Color</th>
              <th>Carat Weight (From)</th>
              <th>Carat Weight (To)</th>
              <th>Price Per Carat (Hundred)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredGemstones.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No results found
                </td>
              </tr>
            ) : (
              filteredGemstones.map((gemstone) => (
                <tr key={gemstone.id}>
                  <td>{gemstone.id}</td>
                  <td>{gemstone.name}</td>
                  <td>{gemstone.shape}</td>
                  <td>{gemstone.cut}</td>
                  <td>{gemstone.clarity}</td>
                  <td>{gemstone.color}</td>
                  <td>{gemstone.caratWeightFrom}</td>
                  <td>{gemstone.caratWeightTo}</td>
                  <td>{gemstone.pricePerCaratInHundred}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default GemstoneList;
