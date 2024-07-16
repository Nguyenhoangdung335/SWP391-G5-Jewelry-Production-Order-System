import React from "react";
import { Button, Form, FormControl, Table } from "react-bootstrap";

function QuotationBody({
  decodedToken,
  title,
  setTitle,
  createdDate,
  setCreatedDate,
  expiredDate,
  setExpiredDate,
  quotationItems,
  handleAddItem,
  handleRemoveItem,
  handleInputChange,
  formatPrice,
  finalPrice,
  readOnly = false,
}) {
  const getQuotationItems = quotationItems.map((item) => (
    <tr key={item.itemID}>
      <td>{item.itemID}</td>
      <td>
        <FormControl
          type="text"
          value={item.name}
          onChange={(e) =>
            handleInputChange && handleInputChange(item.itemID, "name", e.target.value)
          }
          readOnly={readOnly || !["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
        />
      </td>
      <td>
        <FormControl
          type="number"
          value={item.quantity}
          onChange={(e) =>
            handleInputChange && handleInputChange(item.itemID, "quantity", parseFloat(e.target.value))
          }
          readOnly={readOnly || !["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
        />
      </td>
      <td>
        <FormControl
          type="number"
          value={item.unitPrice}
          onChange={(e) =>
            handleInputChange && handleInputChange(item.itemID, "unitPrice", parseFloat(e.target.value))
          }
          readOnly={readOnly || !["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
        />
      </td>
      <td>{formatPrice(item.totalPrice || 0)}</td>
      <td>
        {["ADMIN", "SALE_STAFF"].includes(decodedToken.role) && handleRemoveItem && !readOnly && (
          <Button variant="danger" onClick={() => handleRemoveItem(item.itemID)}>
            Remove
          </Button>
        )}
      </td>
    </tr>
  ));

  return (
    <>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <FormControl
          type="text"
          value={title}
          onChange={(e) => setTitle && setTitle(e.target.value)}
          readOnly={readOnly || !["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Created Date</Form.Label>
        <FormControl
          type="date"
          value={createdDate}
          onChange={(e) => setCreatedDate && setCreatedDate(e.target.value)}
          readOnly={readOnly || !["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Expired Date</Form.Label>
        <FormControl
          type="date"
          value={expiredDate}
          onChange={(e) => setExpiredDate && setExpiredDate(e.target.value)}
          readOnly={readOnly || !["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
        />
      </Form.Group>
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getQuotationItems}
          <tr>
            <td colSpan={4}>Final Price</td>
            <td>{formatPrice(finalPrice)}</td>
          </tr>
        </tbody>
      </Table>
      {["ADMIN", "SALE_STAFF"].includes(decodedToken.role) && handleAddItem && !readOnly && (
        <Button onClick={handleAddItem}>Add Item</Button>
      )}
    </>
  );
}

export default QuotationBody;
