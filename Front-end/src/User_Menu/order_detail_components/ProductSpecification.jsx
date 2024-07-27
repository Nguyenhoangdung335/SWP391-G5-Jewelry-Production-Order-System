import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import ServerUrl from "../../reusable/ServerUrl";
import axios from "axios";
import { useAlert } from "../../provider/AlertProvider";
import { RenderSpecificationForm } from "../../orderFlows/CustomDesignOptions";

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

const renderSpecification = ( specification, parentKey = "") => {

  const renderNested = (obj, parentKey) => {
    return Object.entries(obj).map(([key, value]) => {
      const formattedKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        if (key === "metal") {
          return (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString("metal")}</td>
              <td className="d-flex gap-2">{value.name} ({value.unit})</td>
            </tr>
          );
        } else if (key.startsWith("gemstone")) {
          return (
            <React.Fragment key={formattedKey}>
              {renderNested(value, formattedKey)}
            </React.Fragment>
          );
        } else {
          return renderNested(value, formattedKey);
        }
      } else {
        const lowercaseKey = formattedKey.toLowerCase();
        if (lowercaseKey.includes("gemstone") && !key.toLowerCase().includes("gemstone")) key = "Gemstone " + key;
        return (!lowercaseKey.includes("id") && !lowercaseKey.includes("status") && !lowercaseKey.includes("weightto") && !lowercaseKey.includes("weightfrom") && String(value).toLowerCase() !== "nan")  && (
          <tr key={formattedKey}>
            <td style={{ width: "50%" }}>{formatString(key)}</td>
            <td>{(value)}</td>
          </tr>
        );
      }
    });
  };

  return renderNested(specification, parentKey);
};

const ProductSpecificationTable = ({ orderStatus, selectedProduct, role, isEditing, fetchData }) => {
  console.log(orderStatus + " " + role + " " + ["IN_EXCHANGING", "ORDER_COMPLETED"].includes(orderStatus));
  const isQualifiedEdit = (["IN_EXCHANGING", "ORDER_COMPLETED"].includes(orderStatus) && ["ADMIN", "SALE_STAFF", "CUSTOMER"].includes(role)) || isEditing;

  const {showAlert} = useAlert();
  const [editMode, setEditMode] = useState(isEditing);
  const [formValues, setFormValues] = useState(selectedProduct.specification);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setFormValues(selectedProduct?.specification || {});
  }, [selectedProduct]);

  const handleEdit = (event) => {
    setEditMode(true);
    setShowEditModal(true);
  };

  const handleSave = async (event, formState, selectedGemstoneProp) => {
    event.preventDefault();
    const productSpecification = {
      id: formValues.id,
      type: formState.selectedType,
      style: formState.selectedStyle,
      occasion: formState.selectedOccasion,
      length: formState.selectedLength,
      metal: formState.selectedMetal,
      metalWeight: formState.selectedMetalWeight,
      texture: formState.selectedTexture,
      chainType: formState.selectedChainType,
      gemstone: selectedGemstoneProp.selectedGemstone,
      gemstoneWeight: Number(selectedGemstoneProp.selectedGemstoneWeight)
    };

    try {
      const response = await axios.put(
        `${ServerUrl}/api/products/customize/${formValues.id}`, productSpecification,
      );
      if (response.status === 200) {
        showAlert("Product specification saved successfully", "", "success");
        setEditMode(false);
        setShowEditModal(false);
        fetchData();
      }
    } catch (error) {
      showAlert("Failed to save product specification", "", "danger");
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <tbody>{renderSpecification(formValues,)}</tbody>
      </Table>
      {isQualifiedEdit && ((editMode && (
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
        <Button style={{ width: "100%" }} variant="primary" onClick={handleEdit}>
          Edit
        </Button>
      )))}
      {showEditModal && (
        <Modal centered keyboard size="xl" scrollable animation show={showEditModal} onHide={() => {setShowEditModal(false); setEditMode(false)}}>
          <Modal.Header style={{width: "100%"}} closeButton ><p style={{ fontSize: "1.6em", fontWeight: "bold", textAlign: "center", width: "100%"}}>Edit Specification</p></Modal.Header>
          <Modal.Body style={{width: "100%"}}>
            <RenderSpecificationForm handleSubmit={handleSave} initialSpecs={formValues}/>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ProductSpecificationTable;
