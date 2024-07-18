import React from "react";
import { Table } from "react-bootstrap";

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

const renderSpecification = (specification) => {
  const renderNested = (obj, parentKey) => {
    return Object.entries(obj).map(([key, value]) => {
      const formattedKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        if (key === "metal") {
          // Render metal name and unit in one cell
          return (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString("metal")}</td>
              <td>{`${value.name} (${value.unit})`}</td>
            </tr>
          );
        } else if (key.startsWith("gemstone")) {
          console.log(key);
          return (
            <React.Fragment key={formattedKey}>
              {renderNested(value, formattedKey)}
            </React.Fragment>
          );
        } else if (key === "type" && parentKey === "gemstone") {
          return (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString("Gemstone")}</td>
              <td>{formatString(value.name)}</td>
            </tr>
          );
        } else {
          return renderNested(value, formattedKey);
        }
      } else {
        if (formattedKey.toLowerCase().includes("gemstone")) key = "Gemstone " + key;
        return (
						!formattedKey.toLowerCase().includes("id") && key !== "id" && (
            <tr key={formattedKey}>
              <td style={{ width: "50%" }}>{formatString(key)}</td>
              <td>{formatEnumString(value)}</td>
            </tr>
          )
        );
      }
    });
  };

  return renderNested(specification, "");
};

const ProductSpecificationTable = ({ selectedProduct }) => {
	return (
    <Table striped bordered hover>
      <tbody>{renderSpecification(selectedProduct.specification)}</tbody>
    </Table>
  );
};

export default ProductSpecificationTable;
