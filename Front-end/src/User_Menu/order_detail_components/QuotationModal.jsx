import axios from "axios";
import { useEffect, useState } from "react";
import ServerUrl from "../../reusable/ServerUrl";
import {
  Button,
  Form,
  Modal,
  Table,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import CreateReport from "../../orderFlows/CreateReport";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../provider/AuthProvider";
import "./css/QuotationModal.css";
import { useAlert } from "../../provider/AlertProvider";

function QuotationModal({ data, quotation, orderId, show, onHide, fetchData }) {
  const {showAlert} = useAlert();
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);
  const currentDate = new Date();
  const paymentMethods = ["CREDIT_CARD", "PAYPAL", "BANK", "CARRIER", "ALTERNATE_PAYMENT", "PAY_UPON_INVOICE", ];

  const isQualifyApproving =
  ["ADMIN", "CUSTOMER", "MANAGER"].includes(decodedToken.role) &&
  (
    (decodedToken.role === "ADMIN" && ["AWAIT", "APPROVAL"].every(sub => data.status.includes(sub))) ||
    (decodedToken.role === "CUSTOMER" && data.status === "QUO_AWAIT_CUST_APPROVAL") ||
    (decodedToken.role === "MANAGER" && data.status === "QUO_AWAIT_MANA_APPROVAL")
  );

    const isQualifyCreateQuotation =
    ["ADMIN", "SALE_STAFF"].includes(decodedToken.role) &&
    data.status === "IN_EXCHANGING";

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const initialQuotation = quotation
    ? quotation
    : {
        title: "Quotation for order " + data.id,
        createdDate: currentDate.toISOString().split("T")[0],
        expiredDate: new Date(currentDate.setMonth(currentDate.getMonth() + 3)).toISOString().split("T")[0],
        quotationItems: [],
      };

  const [quotationItems, setQuotationItems] = useState(
    initialQuotation.quotationItems
  );
  const [currId, setCurrentId] = useState(quotationItems?.length || 0);
  const [title, setTitle] = useState(initialQuotation.title);
  const [createdDate, setCreatedDate] = useState(formatDate(initialQuotation.createdDate));
  const [expiredDate, setExpiredDate] = useState(formatDate(initialQuotation.expiredDate));
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [quotationId, setQuotationId] = useState(null);
  const [confirmNotification, setConfirmNotification] = useState(null);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  useEffect(() => {
    if (isQualifyCreateQuotation) {
      let updatedQuotationItems;
      if (quotation && quotation.quotationItems?.length > 0) {
        updatedQuotationItems = quotation.quotationItems;
        setQuotationItems(updatedQuotationItems);
        setCurrentId(updatedQuotationItems?.length || 0);
        setTitle(quotation?.title);
        setCreatedDate(quotation?.createdDate);
        setExpiredDate(quotation?.expiredDate);
      } else {
        const handleFetchInitialQuotation = async () => {
          try {
            const response = await axios.get(`${ServerUrl}/api/quotation/${orderId}/default-items`);
            if (response.status === 200) {
              setQuotationItems(response.data.responseList.items);
              setCurrentId(response.data.responseList.items.length || 0);
            }
          } catch (error) {
            console.error(error);
          }
        };

        handleFetchInitialQuotation();
      }
    }
  }, [quotation, isQualifyCreateQuotation, orderId]);

  useEffect(() => {
    if (isQualifyApproving) {
      axios
        .get(`${ServerUrl}/api/notifications/${orderId}/get-confirm`)
        .then((res) => {
          if (res.status === 200) {
            setConfirmNotification(res.data.responseList.notification);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isQualifyApproving, orderId]);

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
      if (item.itemID === itemID && !item.name.toLowerCase().includes("gemstone")) {
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

  const handleApproveQuotation = async (confirmed) => {
    console.log(confirmed);
    const confirmedBool = Boolean(confirmed);
    const url = `${ServerUrl}/api/notifications/${orderId}/${confirmNotification.id}/confirm?confirmed=${confirmedBool}`;

    try {
      const response = await axios.post(url);
      if (response.status === 200) {
        onHide();
        showAlert("Quotation confirm successfully", "", "success");
        fetchData();
      }
    } catch (error) {
      showAlert("Failed to confirm quotation", "", "danger");
    }
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
            readOnly={!isQualifyCreateQuotation}
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
            readOnly={!isQualifyCreateQuotation}
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
            readOnly={!isQualifyCreateQuotation}
          />
        </td>
        <td>{formatPrice(item.totalPrice || 0)}</td>
        {isQualifyCreateQuotation && (
          <td>
            <Button variant="danger" onClick={() => handleRemoveItem(item.itemID)} >
              Remove
            </Button>
          </td>
        )}
      </tr>
    );
  });

  const finalPrice = quotationItems.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );

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
        `${ServerUrl}/api/quotation/${orderId}/submit`,
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
        onHide();
        showAlert("Quotation Submit successfully", "", "success");
        fetchData();
      }
    } catch (error) {
      showAlert("Failed to submit quotation", "", "danger");
    }
  };

  const handleMakePayment = async (ev) => {
    setButtonIsLoading(true);

    const resultURL = `${window.location.href}?id=${orderId}`;
    try {
      const response = await axios.post(
        `${ServerUrl}/api/payment/create/${orderId}?quotationId=${quotation.id}&resultURL=${resultURL}&method=${paymentMethods[1]}`
      );
      if (response.status === 200) {
        window.location.href = response.data.responseList.url;
        setButtonIsLoading(false);
      }
    } catch (error) {
      showAlert("Failed to redirect user to payment page", "", "danger");
    }
  };

  return (
    <>
      <Modal
        data={data}
        quotation={quotation}
        orderId={orderId}
        show={show}
        onHide={onHide}
        backdrop="static"
        animation
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{height: "100%"}}
      >
        <Modal.Header className="w-100" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Quotations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{width: "100%"}}>
          <Col md={12}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">Title:</Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  readOnly={!isQualifyCreateQuotation}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">Created Date:</Form.Label>
              <Col sm="4">
                <Form.Control
                  type="date"
                  value={createdDate}
                  onChange={(e) => setCreatedDate(e.target.value)}
                  readOnly={!isQualifyCreateQuotation}
                />
              </Col>
              <Form.Label column sm="2">Expired Date:</Form.Label>
              <Col sm="4">
                <Form.Control
                  type="date"
                  value={expiredDate}
                  onChange={(e) => setExpiredDate(e.target.value)}
                  readOnly={!isQualifyCreateQuotation}
                />
              </Col>
            </Form.Group>
            <div >
            <Table bordered hover striped className="table-fixed">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  {isQualifyCreateQuotation &&
                    <th>Action</th>
                  }
                </tr>
              </thead>
              <tbody>
                {getQuotationItems}
                <tr style={{ position: "sticky", bottom: "0"}}>
                  <td colSpan={4}>Final Price</td>
                  <td>{formatPrice(finalPrice)}</td>
                </tr>
              </tbody>
            </Table>
            </div>
            {isQualifyCreateQuotation && (
              <Button onClick={handleAddItem}>Add Item</Button>
            )}
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
          {["ADMIN", "SALE_STAFF"].includes(decodedToken.role) &&
            data.status === "IN_EXCHANGING" && (
              <Button onClick={handleSubmit}>Submit quotation</Button>
            )}
          {["CUSTOMER"].includes(decodedToken.role) &&
            ["AWAIT_BET_TRANSACTION", "AWAIT_REMAIN_TRANSACTION"].includes(data.status) && (
              <Button
                onClick={buttonIsLoading ? null: handleMakePayment}
                disabled={buttonIsLoading}
              >
                {buttonIsLoading ? "Loading...": "Make Payment"}
              </Button>
            )}
          {isQualifyApproving && (
            <>
              <Button onClick={() => handleApproveQuotation(false)}>Declined Quotation</Button>
              <Button onClick={() => handleApproveQuotation(true)}>Approve Quotation</Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {showCreateReport && (
        <CreateReport
          reportContentId={quotationId}
          orderId={orderId}
          reportType="QUOTATION"
          onHide={() => setShowCreateReport(false)}
        />
      )}
    </>
  );
}

export default QuotationModal;
