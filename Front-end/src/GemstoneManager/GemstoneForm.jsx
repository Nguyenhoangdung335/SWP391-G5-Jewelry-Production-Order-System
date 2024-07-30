import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
import DoubleRangeSlider from "../reusable/DoubleRangeSlider/DoubleRangeSlider";

export function GemstoneForm({ types, selectedGemstone, isUpdated, onClose }) {
  const [name, setName] = useState(
    selectedGemstone ? selectedGemstone.name : ""
  );
  const [shape, setShape] = useState(
    selectedGemstone ? selectedGemstone.shape : ""
  );
  const [minWeight, setMinWeight] = useState(
    selectedGemstone ? selectedGemstone.caratWeightFrom : 0.1
  );
  const [maxWeight, setMaxWeight] = useState(
    selectedGemstone ? selectedGemstone.caratWeightTo : 11
  );
  const [clarity, setClarity] = useState(
    selectedGemstone ? selectedGemstone.clarity : ""
  );
  const [color, setColor] = useState(
    selectedGemstone ? selectedGemstone.color : ""
  );
  const [cut, setCut] = useState(selectedGemstone ? selectedGemstone.cut : "");
  const [pricePerCaratInHundred, setPricePerCaratInHundred] = useState(
    selectedGemstone ? selectedGemstone.pricePerCaratInHundred : null
  );
  const [data, setData] = useState({});

  useEffect(() => {
    getGemstoneFactor();
  }, []);

  const getGemstoneFactor = () => {
    axios({
      url: `${ServerUrl}/api/gemstone/props`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setData(res.data.responseList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleConfirmAdd = (e) => {
    e.preventDefault();

    axios({
      url: `${ServerUrl}/api/gemstone`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        name: name,
        shape: shape,
        cut: cut,
        clarity: clarity,
        color: color,
        caratWeightFrom: minWeight,
        caratWeightTo: maxWeight,
        pricePerCaratInHundred: pricePerCaratInHundred / 100,
      },
    })
      .then((res) => {
        isUpdated(true);
        alert(res.data.message);
      })
      .catch((err) => alert(err));
  };

  const handleConfirmEdit = (e) => {
    e.preventDefault();

    axios({
      url: `${ServerUrl}/api/gemstone`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: {
        id: selectedGemstone.id,
        name: name,
        shape: shape,
        cut: cut,
        clarity: clarity,
        color: color,
        caratWeightFrom: minWeight,
        caratWeightTo: maxWeight,
        pricePerCaratInHundred: pricePerCaratInHundred / 100,
      },
    })
      .then((res) => {
        isUpdated(true);
        alert(res.data.message);
      })
      .catch((err) => alert(err));
  };

  return (
    <>
      <Form
        onSubmit={
          types === "addGemstone" ? handleConfirmAdd : handleConfirmEdit
        }
      >
        <FormGroup className="mb-3">
          <FormLabel>Name: </FormLabel>
          <FormControl
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Shape: </FormLabel>
          <FormSelect
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            required
            aria-label="shapes-select"
          >
            <option value="" disabled>
              Choose one
            </option>
            {data.shapes &&
              data.shapes.map((shape) => (
                <option key={shape} value={shape}>
                  {shape}
                </option>
              ))}
          </FormSelect>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Cut: </FormLabel>
          <FormSelect
            value={cut}
            onChange={(e) => setCut(e.target.value)}
            required
            aria-label="cuts-select"
          >
            <option value="" disabled>
              Choose one
            </option>
            {data.cuts &&
              data.cuts.map((cut) => (
                <option key={cut} value={cut}>
                  {cut}
                </option>
              ))}
          </FormSelect>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Color: </FormLabel>
          <FormSelect
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            aria-label="colors-select"
          >
            <option value="" disabled>
              Choose one
            </option>
            {data.colors &&
              data.colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </FormSelect>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Clarity: </FormLabel>
          <FormSelect
            value={clarity}
            onChange={(e) => setClarity(e.target.value)}
            required
            aria-label="clarities-select"
          >
            <option value="" disabled>
              Choose one
            </option>
            {data.clarities &&
              data.clarities.map((clarity) => (
                <option key={clarity} value={clarity}>
                  {clarity}
                </option>
              ))}
          </FormSelect>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>
            Carat Weight: {minWeight} - {maxWeight}
          </FormLabel>
          <DoubleRangeSlider
            min={0.1}
            max={11}
            onChange={({ min, max }) => {
              setMinWeight(min);
              setMaxWeight(max);
            }}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Price Per Carat: </FormLabel>
          <FormControl
            type="number"
            min={0}
            value={pricePerCaratInHundred}
            placeholder="Enter Price"
            onChange={(e) => {
              if (e.target.value > 0) {
                setPricePerCaratInHundred(e.target.value);
              } else {
                setPricePerCaratInHundred();
              }
            }}
            required
          />
        </FormGroup>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={onClose} className="mt-2">
            Back
          </Button>
          <Button variant="primary" type="submit" className="mt-2">
            {types === "addGemstone" ? "Add" : "Save Changes"}
          </Button>
        </div>
      </Form>
    </>
  );
}
