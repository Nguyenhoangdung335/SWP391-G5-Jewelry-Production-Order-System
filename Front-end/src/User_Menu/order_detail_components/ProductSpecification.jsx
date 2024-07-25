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

const renderSpecification = ( specification, editMode, handleChange, parentKey = "") => {
  const ignoreKeyword = ["id", "status", "weightto", "weightfrom"];

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

// const renderSpecification = (specification, editMode, handleChange) => {
//   return (
//     <>
//       <tr>
//         <td style={{ width: "50%" }}>Type</td>
//         <td>
//           {editMode ? (
//             <Form.Control
//               type="text"
//               value={formValues.type}
//               onChange={(e) => handleChange(e, "type", e.target.value)}
//             />
//           ) : (
//             formatString(formValues.type)
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Style</td>
//         <td>
//           {editMode ? (
//             <Form.Control
//               type="text"
//               value={formValues.style}
//               onChange={(e) => handleChange(e, "style", e.target.value)}
//             />
//           ) : (
//             formatString(formValues.style)
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Occasion</td>
//         <td>
//           {editMode ? (
//             <Form.Control
//               type="text"
//               value={formValues.occasion}
//               onChange={(e) => handleChange(e, "occasion", e.target.value)}
//             />
//           ) : (
//             formatString(formValues.occasion)
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Length</td>
//         <td>
//           {editMode ? (
//             <Form.Control
//               type="text"
//               value={formValues.length}
//               onChange={(e) => handleChange(e, "length", e.target.value)}
//             />
//           ) : (
//             formatString(formValues.length)
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Texture</td>
//         <td>
//           {editMode ? (
//             <Form.Control
//               type="text"
//               value={formValues.texture}
//               onChange={(e) => handleChange(e, "texture", e.target.value)}
//             />
//           ) : (
//             formatString(formValues.texture)
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Chain Type</td>
//         <td>
//           {editMode ? (
//             <Form.Control
//               type="text"
//               value={formValues.chainType}
//               onChange={(e) => handleChange(e, "chainType", e.target.value)}
//             />
//           ) : (
//             formatString(formValues.chainType)
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Gemstone</td>
//         <td>
//           {editMode ? (
//             <div>
//               <Form.Control
//                 type="text"
//                 value={formValues.gemstone.name}
//                 onChange={(e) =>
//                   handleChange(e, "gemstone.name", e.target.value)
//                 }
//               />
//               <Form.Control
//                 type="text"
//                 value={formValues.gemstone.shape}
//                 onChange={(e) =>
//                   handleChange(e, "gemstone.shape", e.target.value)
//                 }
//               />
//               <Form.Control
//                 type="text"
//                 value={formValues.gemstone.cut}
//                 onChange={(e) =>
//                   handleChange(e, "gemstone.cut", e.target.value)
//                 }
//               />
//               <Form.Control
//                 type="text"
//                 value={formValues.gemstone.clarity}
//                 onChange={(e) =>
//                   handleChange(e, "gemstone.clarity", e.target.value)
//                 }
//               />
//               <Form.Control
//                 type="text"
//                 value={formValues.gemstone.color}
//                 onChange={(e) =>
//                   handleChange(e, "gemstone.color", e.target.value)
//                 }
//               />
//               <Form.Control
//                 type="number"
//                 value={formValues.gemstone.caratWeightFrom}
//                 onChange={(e) =>
//                   handleChange(
//                     e,
//                     "gemstone.caratWeightFrom",
//                     e.target.value
//                   )
//                 }
//               />
//               <Form.Control
//                 type="number"
//                 value={formValues.gemstone.caratWeightTo}
//                 onChange={(e) =>
//                   handleChange(e, "gemstone.caratWeightTo", e.target.value)
//                 }
//               />
//             </div>
//           ) : (
//             <div>
//               {formatString(formValues.gemstone.name)} (
//               {formatString(formValues.gemstone.shape)},{" "}
//               {formatString(formValues.gemstone.cut)},{" "}
//               {formatString(formValues.gemstone.clarity)},{" "}
//               {formatString(formValues.gemstone.color)},{" "}
//               {formValues.gemstone.caratWeightFrom} -{" "}
//               {formValues.gemstone.caratWeightTo} carats)
//             </div>
//           )}
//         </td>
//       </tr>
//       <tr>
//         <td style={{ width: "50%" }}>Metal</td>
//         <td>
//           {editMode ? (
//             <div>
//               <Form.Control
//                 type="text"
//                 value={formValues.metal.name}
//                 onChange={(e) => handleChange(e, "metal.name", e.target.value)}
//               />
//               <Form.Control
//                 type="text"
//                 value={formValues.metal.unit}
//                 onChange={(e) => handleChange(e, "metal.unit", e.target.value)}
//               />
//             </div>
//           ) : (
//             `${formatString(formValues.metal.name)} (${formatString(formValues.metal.unit)})`
//           )}
//         </td>
//       </tr>
//       </>
//   );
// }

const ProductSpecificationTable = ({ orderStatus, selectedProduct, role, isEditing = true }) => {
  const isQualifiedEdit = (["IN_EXCHANGING", "ORDER_COMPLETED"].includes(orderStatus) && ["ADMIN", "SALE_STAFF", "CUSTOMER"].includes(role)) || isEditing;

  const {showAlert} = useAlert();
  const [editMode, setEditMode] = useState(isEditing);
  const [formValues, setFormValues] = useState(selectedProduct.specification);
  const [metalData, setMetalData] = useState([]);
  const [gemstoneData, setGemstoneData] = useState({
    shapes: [],
    cuts: [],
    clarities: [],
    colors: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (isQualifiedEdit && isEditing) {
      const fetchPrice = async () => {
        try {
          const response = await axios.get(`${ServerUrl}/api/gemstone/factors`);
          if (response.status === 200) {
            const data = response.data.responseList;
            setMetalData(data.metal);
            setGemstoneData({
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
  }, [isQualifiedEdit, isEditing]);

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
  };

  const handleEdit = (event) => {
    setEditMode(true);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${ServerUrl}/api/products/customize/${formValues.id}`, formValues,
      );
      if (response.status === 200) {
        showAlert("Product specification saved successfully", "", "success");
        setEditMode(false);
        setShowEditModal(false);
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
            <RenderSpecificationForm handleSubmit={handleSave} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ProductSpecificationTable;
