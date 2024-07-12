import axios from "axios";
import { useEffect, useState } from "react";
import ServerUrl from "../reusable/ServerUrl";
import { Button, Form, Modal, Table, FormControl } from "react-bootstrap";
import CreateReport from "../orderFlows/CreateReport";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";

function QuotationModal(props) {
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);

  const initialQuotation = props.quotation
    ? props.quotation
    : {
        title: "",
        createdDate: new Date().toISOString().split("T")[0],
        expiredDate: "",
        quotationItems: [],
      };

  const [quotationItems, setQuotationItems] = useState(
    initialQuotation.quotationItems
  );
  const [currId, setCurrentId] = useState(quotationItems.length);
  const [title, setTitle] = useState(initialQuotation.title);
  const [createdDate, setCreatedDate] = useState(initialQuotation.createdDate);
  const [expiredDate, setExpiredDate] = useState(initialQuotation.expiredDate);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [quotationId, setQuotationId] = useState(null);

  useEffect(() => {
    // Update the quotationItems state if props.quotation changes
    if (props.quotation) {
      setQuotationItems(props.quotation.quotationItems);
      setCurrentId(props.quotation.quotationItems.length);
      setTitle(props.quotation.title);
      setCreatedDate(props.quotation.createdDate);
      setExpiredDate(props.quotation.expiredDate);
    }
  }, [props.quotation]);

  const handleAddItem = () => {
    const newItem = {
      itemID: currId, // Unique ID
      name: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setQuotationItems([...quotationItems, newItem]);
    setCurrentId(currId + 1);
  };

  const handleRemoveItem = (itemID) => {
    const updatedItems = quotationItems.filter(
      (item) => item.itemID !== itemID
    );
    setQuotationItems(updatedItems);
    setCurrentId(currId - 1);
  };

  const handleInputChange = (itemID, field, value) => {
    const updatedItems = quotationItems.map((item) => {
      if (item.itemID === itemID) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          const quantity = updatedItem.quantity || 0;
          const unitPrice = updatedItem.unitPrice || 0;
          updatedItem.totalPrice = quantity * unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    setQuotationItems(updatedItems);
  };

  const getQuotationItems = quotationItems.map((item) => {
    return (
      <tr key={item.itemID}>
        <td>{item.itemID}</td>
        <td>
          <FormControl
            type="text"
            value={item.name}
            onChange={(e) =>
              handleInputChange(item.itemID, "name", e.target.value)
            }
            readOnly={!["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
          />
        </td>
        <td>
          <FormControl
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleInputChange(
                item.itemID,
                "quantity",
                parseFloat(e.target.value)
              )
            }
            readOnly={!["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
          />
        </td>
        <td>
          <FormControl
            type="number"
            value={item.unitPrice}
            onChange={(e) =>
              handleInputChange(
                item.itemID,
                "unitPrice",
                parseFloat(e.target.value)
              )
            }
            readOnly={!["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
          />
        </td>
        <td>{item.totalPrice || 0}</td>
        <td>
          {["ADMIN", "SALE_STAFF"].includes(decodedToken.role) && (
              <Button
                  variant="danger"
                  onClick={() => handleRemoveItem(item.itemID)}
              >
                Remove
              </Button>
          )}
        </td>
      </tr>
    );
  });

  const finalPrice = quotationItems.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quotationData = {
      title,
      createdDate: formatDate(createdDate),
      expiredDate: formatDate(expiredDate),
      quotationItems,
    };
    try {
      const response = await axios.post(
        `${ServerUrl}/api/${props.orderId}/quotation/submit`,
        quotationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setQuotationId(response.data.responseList.quotation.id);
        setShowCreateReport(true);
        props.onHide();
      }
    } catch (error) {
      console.error("Error submitting quotation:", error);
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="w-100" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Quotations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <FormControl
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={!["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Created Date</Form.Label>
            <FormControl
              type="date"
              value={createdDate}
              onChange={(e) => setCreatedDate(e.target.value)}
              readOnly={!["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Expired Date</Form.Label>
            <FormControl
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
              readOnly={!["ADMIN", "SALE_STAFF"].includes(decodedToken.role)}
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
                <td>{finalPrice}</td>
              </tr>
            </tbody>
          </Table>
          {["ADMIN", "SALE_STAFF"].includes(decodedToken.role) && (
              <Button onClick={handleAddItem}>Add Item</Button>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          {["ADMIN", "SALE_STAFF"].includes(decodedToken.role) && (
              <Button onClick={handleSubmit}>Submit quotation</Button>
          )}
        </Modal.Footer>
      </Modal>

      {showCreateReport && (
        <CreateReport
          reportContentId={quotationId}
          orderId={props.orderId}
          reportType="QUOTATION"
          onHide={() => setShowCreateReport(false)}
        />
      )}
    </>
  );
}

export default QuotationModal;
