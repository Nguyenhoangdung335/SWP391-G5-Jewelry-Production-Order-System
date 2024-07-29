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
  Container,
  InputGroup,
} from "react-bootstrap";
import CreateReport from "../../orderFlows/CreateReport";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../provider/AuthProvider";
import "./css/QuotationModal.css";
import { useAlert } from "../../provider/AlertProvider";
import ResizableTable from "../../reusable/ResizableTable";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

function QuotationModal({ data, passedQuotation, orderId, show, onHide, fetchData }) {
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

  const initialQuotation = passedQuotation
    ? passedQuotation
    : {
        title: "Quotation for order " + data.id,
        createdDate: currentDate.toISOString().split("T")[0],
        expiredDate: new Date(currentDate.setMonth(currentDate.getMonth() + 3)).toISOString().split("T")[0],
        quotationItems: [],
      };

  const [quotation, setQuotation] = useState({
    id: passedQuotation? passedQuotation.id: "",
    title: passedQuotation? passedQuotation.title: "",
    createdDate: passedQuotation? passedQuotation.createdDate: currentDate.toISOString().split("T")[0],
    expiredDate: passedQuotation? passedQuotation.expiredDate: new Date(currentDate.setMonth(currentDate.getMonth() + 3)).toISOString().split("T")[0],
    quotationItems: passedQuotation? passedQuotation.quotationItems: [{
      itemID: 0,
      name: "",
      quantity: 0,
      unitPrice: 0,
      unit: "",
      totalPrice: 0,
    }],
    consultCost: 0,
    designCost: 0,
    manufactureCost: 0,
    markupRatio: 0,
    totalPrice: 0,
    finalPrice: 0,
  });

  // const [quotationItems, setQuotationItems] = useState(
  //   initialQuotation.quotationItems
  // );
  const [currId, setCurrentId] = useState(0);
  // const [title, setTitle] = useState(initialQuotation.title);
  // const [createdDate, setCreatedDate] = useState(formatDate(initialQuotation.createdDate));
  // const [expiredDate, setExpiredDate] = useState(formatDate(initialQuotation.expiredDate));
  // const [quotationId, setQuotationId] = useState(null);
  const [confirmNotification, setConfirmNotification] = useState(null);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [showCreateReport, setShowCreateReport] = useState(false);

  useEffect(() => {
    setQuotation(passedQuotation);
    if (isQualifyCreateQuotation) {
      if (!passedQuotation || (passedQuotation?.quotationItems?.length === 0)) {
        const handleFetchInitialQuotation = async () => {
          const response = await axios.get(`${ServerUrl}/api/quotation/${orderId}/default-quote`);
          if (response.status === 200) {
            const defaultQuote = response.data.responseList.quotation;
            setQuotation((prev) => ({
              ...prev,
              title: defaultQuote.title,
              createdDate: currentDate.toISOString().split("T")[0],
              expiredDate: new Date(currentDate.setMonth(currentDate.getMonth() + 3)).toISOString().split("T")[0],
              quotationItems: defaultQuote.quotationItems,
              consultCost: defaultQuote.consultCost,
              designCost: defaultQuote.designCost,
              manufactureCost: defaultQuote.manufactureCost,
              markupRatio: defaultQuote.markupRatio,
            }))
            setCurrentId(defaultQuote?.quotationItems?.length);
          }
        }
        handleFetchInitialQuotation();
      }
    }
  }, [passedQuotation, isQualifyCreateQuotation, orderId, data]);

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
      unit: "",
      totalPrice: 0,
    };
    setQuotation((prev) => ({
      ...prev,
      quotationItems: [...quotation.quotationItems, newItem],
    }));
    setCurrentId(currId + 1);
  };

  const handleRemoveItem = (itemID) => {
    const updatedItems = quotation.quotationItems.filter(
      (item) => item.itemID !== itemID
    );
    setQuotation((prev) => ({
      ...prev,
      quotationItems: updatedItems,
    }));
    setCurrentId(currId - 1);
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setQuotation((prev) => ({...prev, [name]: value }));
  }

  const handleInputChange = (itemID, field, value) => {
    const updatedItems = quotation.quotationItems.map((item) => {
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
    // setQuotationItems(updatedItems);
    setQuotation((prev) => ({
      ...prev,
      quotationItems: updatedItems,
    }))
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

  const getQuotationItems = quotation?.quotationItems?.map((item) => {
    return (
      <tr key={item.itemID}>
        <td>{item.itemID}</td>
        <td>
          <FormControl
            as="textarea"
            rows={2}
            style={{width: "100%"}}
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
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
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
              style={{ display: "inline" }}
            />
          </InputGroup>
        </td>
        <td>
          <FormControl
            type="text"
            value={item.unit}
            onChange={(e) => handleInputChange(item.itemID, "unit",e.target.value)}
            readOnly={!isQualifyCreateQuotation}
          />
        </td>
        <td>{formatPrice(item.totalPrice || 0)}</td  >
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

  const finalPrice = () => {
    let total = quotation?.quotationItems?.reduce(
      (acc, item) => acc + (item.totalPrice || 0),
      0
    );
    return total + quotation?.consultCost + quotation?.designCost + quotation?.manufactureCost;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${ServerUrl}/api/quotation/${orderId}/submit`,
        quotation,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setQuotation((prev) => ({
          ...prev,
          id: response.data.responseList.quotation.id,
        }))
        setShowCreateReport(true);
        onHide();
        showAlert("Quotation Submit successfully", "", "success");
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
        `${ServerUrl}/api/payment/create/${orderId}?quotationId=${passedQuotation.id}&resultURL=${resultURL}&method=${paymentMethods[1]}`
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
        quotation={passedQuotation}
        orderId={orderId}
        show={show}
        onHide={onHide}
        backdrop="static"
        animation
        size="xl"
        fullscreen="xl-down"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
      >
        <Modal.Header className="w-100" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Quotations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{width: "100%"}}>
            {/*   Title Row   */}
            <Row className="mb-2">
                <Col sm={2}>
                <Form.Label style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Title:</Form.Label>
                </Col>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="title"
                    value={quotation?.title}
                    onChange={handleChange}
                    readOnly={!isQualifyCreateQuotation}
                  />
                </Col>
            </Row>
            {/*   Date Row   */}
            <Row className="mb-2">
                <Form.Label column sm="2" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Created Date:</Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="date"
                    name="createdDate"
                    value={quotation?.createdDate}
                    onChange={handleChange}
                    readOnly={!isQualifyCreateQuotation}
                  />
                </Col>
                <Form.Label column sm="2" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Expired Date:</Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="date"
                    name="expiredDate"
                    value={quotation?.expiredDate}
                    onChange={handleChange}
                    readOnly={!isQualifyCreateQuotation}
                  />
                </Col>
            </Row>
            {/*   Labor Cost Row   */}
            <Row style={{textAlign: "center", marginBlock: "5% 2%"}}>
              <Col sm={4} style={{paddingInline: "1.5em"}}>
                <Form.Group>
                  <Row>
                    <Form.Label style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Consult Cost:</Form.Label>
                  </Row>
                  <Row>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="consultCost"
                        value={quotation?.consultCost}
                        onChange={handleChange}
                        readOnly={!isQualifyCreateQuotation}
                      />
                    </InputGroup>
                  </Row>
                </Form.Group>
              </Col>
              <Col sm={4} style={{paddingInline: "1.5em"}}>
                <Form.Group>
                  <Row>
                    <Form.Label style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Design Cost:</Form.Label>
                  </Row>
                  <Row>
                    <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="designCost"
                        value={quotation?.designCost}
                        onChange={handleChange}
                        readOnly={!isQualifyCreateQuotation}
                      />
                    </InputGroup>
                  </Row>
                </Form.Group>
              </Col>
              <Col sm={4} style={{paddingInline: "1.5em"}}>
                <Form.Group>
                  <Row>
                    <Form.Label style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Manufacture Cost:</Form.Label>
                  </Row>
                  <Row>
                    <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="manufactureCost"
                        value={quotation?.manufactureCost}
                        onChange={handleChange}
                        readOnly={!isQualifyCreateQuotation}
                      />
                    </InputGroup>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <div >
            <ResizableTable resizable={true} resizeOptions={{}} className="table-clear" style={{position: "relative"}}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Unit</th>
                  <th>Total Price</th>
                  {isQualifyCreateQuotation &&
                    <th>Action</th>
                  }
                </tr>
              </thead>
              <tbody>
                {getQuotationItems}
                <tr style={{ position: "sticky", bottom: "3%"}}>
                  <td colSpan={4} style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Markup Ratio</td>
                  <td>
                    <InputGroup>
                      <FormControl
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        name="markupRatio"
                        value={quotation?.markupRatio * 100}
                        onChange={(e) => setQuotation((prev) => ({...prev, markupRatio: Number(e.target.value)/100
                        }))}
                        readOnly={!isQualifyCreateQuotation}
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </td>
                  <td colSpan={isQualifyCreateQuotation? 2: 1}>{formatPrice(finalPrice() * quotation?.markupRatio)}</td>
                </tr>
                <tr style={{ position: "sticky", bottom: "-4%"}}>
                  <td colSpan={5} style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Final Price</td>
                  <td colSpan={isQualifyCreateQuotation? 2: 1}>{formatPrice(finalPrice() + finalPrice() * quotation?.markupRatio)}</td>
                </tr>
              </tbody>
            </ResizableTable>
            {/* <Table striped hover bordered style={{ position: "sticky", bottom: "-3%"}}>
              <tbody>
                <tr>
                  <td colSpan={isQualifyCreateQuotation? 5: 4}>Markup Ratio</td>
                  <td>
                    <FormControl
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      name="markupRatio"
                      value={quotation.markupRatio}
                      onChange={(e) => setQuotation((prev) => ({...prev, markupRatio: Number(e.target.value)/100
                      }))}
                      readOnly={!isQualifyCreateQuotation}
                    />
                  </td>
                  <td>{formatPrice(finalPrice * quotation.markupRatio)}</td>
                </tr>
                <tr>
                  <td colSpan={isQualifyCreateQuotation? 6: 5}>Final Price</td>
                  <td>{formatPrice(finalPrice + finalPrice*quotation.markupRatio)}</td>
                </tr>
              </tbody>
            </Table> */}
            </div>
            {isQualifyCreateQuotation && (
              <Button onClick={handleAddItem}>Add Item</Button>
            )}
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
          reportContentId={quotation.id}
          orderId={orderId}
          reportType="QUOTATION"
          onHide={() => setShowCreateReport(false)}
          fetchData={fetchData}
        />
      )}
    </>
  );
}

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatPrice = (price) => {
  if(!price) price = 0;
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export default QuotationModal;
