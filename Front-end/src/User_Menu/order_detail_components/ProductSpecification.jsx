import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import ServerUrl from "../../reusable/ServerUrl";
import axios from "axios";
import { useAlert } from "../../provider/AlertProvider";

const formatString = (str) => {
  if (typeof str === "string") {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1")
    );
  }
  return str;
};

const formatEnumString = (str) => {
  if (typeof str === "string") {
    return (
      str
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/([a-z])/, (char) => char.toUpperCase())
    );
  }
  return str;
};

const renderSpecification = ( specification, editMode, handleChange, parentKey = "") => {
  const renderNested = (obj, parentKey) => {
    return Object.entries(obj).map(([key, value]) => {
      const formattedKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        if (key === "metal") {
          return (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString("metal")}</td>
              <td className="d-flex gap-2">
                {editMode ? (
                  <>
                    <Form.Control
                      type="text"
                      value={value.name}
                      onChange={(e) =>
                        handleChange(e, `${formattedKey}.name`, e.target.value)
                      }
                    />
                    <Form.Control
                      type="text"
                      value={value.unit}
                      onChange={(e) =>
                        handleChange(e, `${formattedKey}.unit`, e.target.value)
                      }
                    />
                  </>
                ) : (
                  `${value.name} (${value.unit})`
                )}
              </td>
            </tr>
          );
        } else if (key.startsWith("gemstone")) {
          return (
            <React.Fragment key={formattedKey}>
              {renderNested(value, formattedKey)}
            </React.Fragment>
          );
        } else if (key === "type" && parentKey === "gemstone") {
          return (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString("Gemstone")}</td>
              <td>
                {editMode ? (
                    <Form.Control
                      type="text"
                      value={value.name}
                      onChange={(e) =>
                        handleChange(e, `${formattedKey}.name`, e.target.value)
                      }
                    />
                ) : (
                  formatString(value.name)
                )}
              </td>
            </tr>
          );
        } else {
          return renderNested(value, formattedKey);
        }
      } else {
        if (formattedKey.toLowerCase().includes("gemstone")) key = "Gemstone " + key;
        return (
          !formattedKey.toLowerCase().includes("id") && !key.toLowerCase().includes("status") &&
          key !== "id" && (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString(key)}</td>
              <td>
                {editMode ? (
                  <Form.Control
                    type={typeof value === "number" ? "number" : "text"}
                    value={value}
                    onChange={(e) =>
                      handleChange(e, formattedKey, e.target.value)
                    }
                  />
                ) : (
                  formatEnumString(value)
                )}
              </td>
            </tr>
          )
        );
      }
    });
  };

  return renderNested(specification, parentKey);
};

const ProductSpecificationTable = ({ orderStatus, selectedProduct, role, isEditing = false }) => {
  const isQualifiedEdit = (["IN_EXCHANGING", "ORDER_COMPLETED"].includes(orderStatus) && ["ADMIN", "SALE_STAFF", "CUSTOMER"].includes(role)) || isEditing;

  const {showAlert} = useAlert();
  const [editMode, setEditMode] = useState(isEditing);
  const [formValues, setFormValues] = useState(selectedProduct.specification);
  const [metalData, setMetalData] = useState([]);
  const [gemstoneData, setGemstoneData] = useState({
    types: [],
    shapes: [],
    cuts: [],
    clarities: [],
    colors: [],
  });

  useEffect(() => {
    if (isQualifiedEdit) {
      const fetchPrice = async () => {
        try {
          const response = await axios.get(`${ServerUrl}/api/gemstone/factors`);
          if (response.status === 200) {
            const data = response.data.responseList;
            setMetalData(data.metal);
            setGemstoneData({
              types: data.type,
              shapes: data.shape,
              cuts: data.cut,
              clarities: data.clarity,
              colors: data.color,
            });
          }
        } catch (error) {
          console.error("Error fetching gemstone and metal:", error);
        }
      };

      fetchPrice();
    }
  }, [isQualifiedEdit]);

  const handleChange = (event, key, newValue) => {
    const keys = key.split(".");
    let updatedValues = { ...formValues };

    let temp = updatedValues;
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = newValue;

    setFormValues(updatedValues);

    if (key === "metal") {
      const selectedMetal = metalData.find((metal) => metal.id === newValue);
      setFormValues(prev => ({
        ...prev,
        metal: selectedMetal
      }));
    } else if (key.startsWith("gemstone")) {
      // Handle gemstone attributes similarly
      // Assume `newValue` is the selected ID and map it to the appropriate gemstone object
    }
  }

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${ServerUrl}/api/products/customize/${formValues.id}`,
        {
          formValues,
        }
      );
      if (response.status === 200) {
        showAlert("Product specification saved successfully", "", "success");
        setEditMode(false);
      }
    } catch (error) {
      showAlert("Failed to save product specification", "", "danger");
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <tbody>{renderSpecification(formValues, editMode, handleChange, metalData, gemstoneData, )}</tbody>
      </Table>
      {/* {isQualifiedEdit && ((editMode && (
        <div className="d-flex justify-content-between gap-lg-5 gap-sm-2">
          <Button style={{ width: "100%" }} variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button style={{ width: "100%" }} variant="primary" onClick={() => setEditMode(!editMode)}>
            Close
          </Button>
        </div>
      )) || (
      !editMode && (
        <Button style={{ width: "100%" }} variant="primary" onClick={() => setEditMode(true)}>
          Edit
        </Button>
      )))} */}
    </>
  );
};

export default ProductSpecificationTable;
