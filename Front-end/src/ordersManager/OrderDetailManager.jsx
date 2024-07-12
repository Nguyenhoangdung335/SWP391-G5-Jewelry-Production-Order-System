import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ServerUrl from "../reusable/ServerUrl";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
  FormControl,
  Spinner,
} from "react-bootstrap";
import snowfall from "../assets/snowfall.jpg";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import ResizeImage from "../reusable/ResizeImage";
import CreateReport from "../orderFlows/CreateReport";
import AssignedStaff from "./AssignedStaff";

function OrderDetailManager() {
  const state = useLocation();
  const [data, setData] = useState(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showDesignReport, setShowDesignReport] = useState(false);
  const [designImage, setDesignImage] = useState(null);
  const id = state.state;
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);
  const [imageLink, setImageLink] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const orderDetail = response.data.responseList.orderDetail;
          setData(orderDetail);
          setImageLink(orderDetail.design?.designLink || snowfall);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const arrayToDate = (date) => {
    if (!date) return "NaN";
    const dateObject1 = new Date(date[0], date[1] - 1, date[2]);
    const isoString = dateObject1.toISOString();
    return isoString.substring(0, 10);
  };

  const handleClose = () => setShowQuotation(false);
  const handleShowQuotations = () => setShowQuotation(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (designImage instanceof File) {
      const resizedImageFile = await ResizeImage(designImage);
      formData.append("file", resizedImageFile);
      const response = await axios.post(
        `${ServerUrl}/api/order/${data.id}/detail/edit-design`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImageLink(response.data.responseList.designUrl);
      setShowDesignReport(true);
    } else {
      console.error("designImage is not a File");
    }
  };

  const handleStaffSubmit = async (updatedStaff) => {
    try {
      await axios.post(
        `${ServerUrl}/api/order/${data.id}/detail/assign-staff`,
        updatedStaff
      );
      alert("Staff assignments updated successfully");
      // Optionally, update the local state if necessary
    } catch (error) {
      console.error("Error updating staff assignments:", error);
      alert("Error updating staff assignments");
    }
  };

  const handleConfirmTransaction = async (isConfirmed) => {
    try {
      await axios.post(
        `${ServerUrl}/api/order/${
          data.id
        }/detail/transaction-confirm?confirmed=${Boolean(isConfirmed)}`
      );
      alert("Confirmed Payment successfully");
    } catch (error) {
      console.error("Error confirming payment: ", error);
      alert("Error confirming payment");
    }
  };

  return (
    <>
      <Container className="pt-4 pb-4">
        <Row>
          <Col md={8}>
            <div className="pb-2">
              <img
                src={imageLink || snowfall}
                alt="Product Image"
                className="w-100 h-100"
              />
            </div>
            <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
              <div className="p-3">
                <h4 className="pb-2">Order Id: {id}</h4>
                <Table bordered hover>
                  <tbody>
                    <tr>
                      <th>Id</th>
                      <td>{data.product?.id || "NaN"}</td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>{data.product?.name || "NaN"}</td>
                    </tr>
                    <tr>
                      <th>Created Date</th>
                      <td>{arrayToDate(data.createdDate)}</td>
                    </tr>
                    <tr>
                      <th>Completed Date</th>
                      <td>{arrayToDate(data.completedDate)}</td>
                    </tr>
                    <tr>
                      <th>Total Price</th>
                      <td>{data.quotation?.totalPrice || 0}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        <Badge
                          className="text-white"
                          bg={
                            data.status === "ORDER_COMPLETED"
                              ? "success"
                              : "danger"
                          }
                        >
                          {data.status}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>

          <Col md={4} style={{ height: "100vh", overflowY: "auto" }}>
            <Row className="pb-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <h4>Customer</h4>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Name:</h6>
                    <p>
                      {data.owner?.userInfo?.firstName || "NaN"}{" "}
                      {data.owner?.userInfo?.lastName || "NaN"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Phone Number:</h6>
                    <p>{data.owner?.userInfo?.phoneNumber || "NaN"}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Address</h6>
                    <p>{data.owner?.userInfo?.address || "NaN"}</p>
                  </div>
                </div>
              </div>
            </Row>
            {data && <AssignedStaff data={data} onSubmit={handleStaffSubmit} />}
            <Row className="pb-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <h4>Specification</h4>
                  </div>
                  <Table>
                    <tbody>
                      <tr>
                        <th>Type</th>
                        <td>{data.product?.specification?.type || "NaN"}</td>
                      </tr>
                      <tr>
                        <th>Style</th>
                        <td>{data.product?.specification?.style || "NaN"}</td>
                      </tr>
                      <tr></tr>
                      <tr>
                        <th>Occasion</th>
                        <td>
                          {data.product?.specification?.occasion || "NaN"}
                        </td>
                      </tr>
                      <tr>
                        <th>Metal</th>
                        <td>{data.product?.specification?.metal || "NaN"}</td>
                      </tr>
                      <tr>
                        <th>Texture</th>
                        <td>{data.product?.specification?.texture || "NaN"}</td>
                      </tr>
                      <tr>
                        <th>Length</th>
                        <td>{data.product?.specification?.length || "NaN"}</td>
                      </tr>
                      <tr>
                        <th>Chain Type</th>
                        <td>
                          {data.product?.specification?.chainType || "NaN"}
                        </td>
                      </tr>
                      <tr>
                        <th>Gem Stone</th>
                        <td>
                          {data.product?.specification?.gemStone || "NaN"}
                        </td>
                      </tr>
                      <tr>
                        <th>Gem Stone Weight</th>
                        <td>
                          {data.product?.specification?.gemStoneWeight || "NaN"}
                        </td>
                      </tr>
                      <tr>
                        <th>Shape</th>
                        <td>{data.product?.specification?.shape || "NaN"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Row>
            <Row className="pb-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <h4 style={{ display: "inline-block" }}>Quotation</h4>
                      <Button onClick={handleShowQuotations}>
                        Show Quotations
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
            <Row className="pb-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <div
                      className="mb-2"
                      style={{
                        borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                      }}
                    >
                      <h4>Confirm Transactions</h4>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button
                        onClick={() => handleConfirmTransaction(true)}
                        className="mt-2 mb-2"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => handleConfirmTransaction(false)}
                        className="mt-2 mb-2"
                      >
                        Declined
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
            <Row className="pb-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <h4>Upload Image</h4>
                  </div>
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Control
                      type="file"
                      name="designImage"
                      accept="image/png, image/gif, image/jpeg, image/jpg"
                      onChange={(e) => setDesignImage(e.target.files[0])}
                    />
                    <div className="d-flex justify-content-end">
                      <Button type="submit" className="mt-2 mb-2">
                        Upload
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>

      <MyVerticallyCenteredModal
        quotation={data.quotation}
        orderId={data.id}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
      />

      {showDesignReport && (
        <CreateReport
          reportContentId={data.design.id}
          orderId={data.id}
          reportType="DESIGN"
          onHide={() => setShowDesignReport(false)}
        />
      )}
    </>
  );
}

function MyVerticallyCenteredModal(props) {
  console.log(props);
  console.log(props.orderId);
  // Initialize the state with an empty quotation object if props.quotation is null
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
          />
        </td>
        <td>{item.totalPrice || 0}</td>
        <td>
          <Button
            variant="danger"
            onClick={() => handleRemoveItem(item.itemID)}
          >
            Remove
          </Button>
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
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Created Date</Form.Label>
            <FormControl
              type="date"
              value={createdDate}
              onChange={(e) => setCreatedDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Expired Date</Form.Label>
            <FormControl
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
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
          <Button onClick={handleAddItem}>Add Item</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={handleSubmit}>Submit quotation</Button>
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

export default OrderDetailManager;
