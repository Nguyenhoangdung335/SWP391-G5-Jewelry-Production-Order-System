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
} from "react-bootstrap";
import snowfall from "../assets/snowfall.jpg";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";

function OrderDetailManager() {
  const state = useLocation();
  const [data, setData] = useState();
  const [showQuotation, setShowQuotation] = useState(false);
  const [designImage, setDesignImage] = useState();
  const id = state.state;
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setData(response.data.responseList.orderDetail);
      }
    };
    fetchData();
  }, [state]);

  if (!data) {
    // Handle loading state or error
    return <div>Loading...</div>;
  }

  console.log(data);

  const arrayToDate = (date) => {
    const dateObject1 = new Date(date[0], date[1] - 1, date[2] + 1);
    const isoString = dateObject1.toISOString();
    const formattedDate = isoString.substring(0, 10);

    return formattedDate;
  };
  const handleClose = () => setShowQuotation(false);
  const handleShowQuotations = () => {
    setShowQuotation(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios(`${ServerUrl}/api/order/${data.id}/detail/edit-design`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      data: {
        designLink: designImage,
      },
    });
  };

  return (
    <>
      <Container className="pt-4 pb-4">
        <Row>
          <Col md={8}>
            <div className="pb-2">
              <img src={snowfall} alt="Product Image" className="w-100 h-100" />
            </div>
            <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
              <div className="p-3">
                <h4 className="pb-2">Order Id: {id}</h4>
                <Table bordered hover>
                  <tr>
                    <th>Id</th>
                    <td>{data.product.id}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{data.product.name}</td>
                  </tr>
                  <tr>
                    <th>Created Date</th>
                    <td>{arrayToDate(data.createdDate)}</td>
                  </tr>
                  <tr>
                    <th>Completed Date</th>
                    <td>{arrayToDate(data.createdDate)}</td>
                  </tr>
                  <tr>
                    <th>Total Price</th>
                    <td>{data.quotation.totalPrice}</td>
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
                </Table>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <Row className="pb-2">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5) ",
                    }}
                  >
                    <h4>Customer</h4>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Name: </h6>
                    <p>
                      {data.owner.userInfo.firstName}{" "}
                      {data.owner.userInfo.lastName}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Phone Number: </h6>
                    <p>{data.owner.userInfo.phoneNumber}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Address</h6>
                    <p>{data.owner.userInfo.address}</p>
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
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5) ",
                    }}
                  >
                    <h4>Specification</h4>
                  </div>
                  <Table>
                    <tr>
                      <th>Type</th>
                      <td>{data.product.specification.type}</td>
                    </tr>
                    <tr>
                      <th>Style</th>
                      <td>{data.product.specification.style}</td>{" "}
                    </tr>{" "}
                    <tr></tr>
                    <tr>
                      <th>Occasion</th>
                      <td>{data.product.specification.occasion}</td>
                    </tr>
                    <tr>
                      <th>Metal</th>
                      <td>{data.product.specification.metal}</td>
                    </tr>
                    <tr>
                      <th>Texture</th>
                      <td>{data.product.specification.texture}</td>
                    </tr>
                    <tr>
                      <th>Length</th>
                      <td>{data.product.specification.length}</td>
                    </tr>
                    <tr>
                      <th>Chain Type</th>
                      <td>{data.product.specification.chainType}</td>
                    </tr>
                    <tr>
                      <th>Gem Stone</th>
                      <td>{data.product.specification.gemStone}</td>
                    </tr>
                    <tr>
                      <th>Gem Stone Weight</th>
                      <td>{data.product.specification.gemStoneWeight}</td>
                    </tr>
                    <tr>
                      <th>Shape</th>
                      <td>{data.product.specification.shape}</td>
                    </tr>
                  </Table>
                  <div
                    onClick={handleShowQuotations}
                    className="d-flex justify-content-end mb-2"
                  >
                    <Button>Show Quotations</Button>
                  </div>
                </div>
              </div>
            </Row>
            {data.owner.role === "DESIGN_STAFF" && (
              <Row className="pb-2">
                <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                  <div className="p-2">
                    <div
                      className="mb-2"
                      style={{
                        borderBottom: "1px solid rgba(166, 166, 166, 0.5) ",
                      }}
                    >
                      <h4>Upload Image</h4>
                    </div>
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Control
                        type="file"
                        name="designImage"
                        value={designImage}
                        accept="image/png, image/gif, image/jpeg, image/jpg"
                        onChange={(e) => setDesignImage(e.target.value)}
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
            )}
          </Col>
        </Row>
      </Container>

      <MyVerticallyCenteredModal
        quotation={data.quotation}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
      />
    </>
  );
}

function MyVerticallyCenteredModal(props) {
    const [quotationItems, setQuotationItems] = useState(props.quotation.quotationItems);
    const [ currId, setCurrentId ] = useState(quotationItems.length);

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
      const updatedItems = quotationItems.filter(item => item.itemID !== itemID);
      setQuotationItems(updatedItems);
      setCurrentId(currId - 1);
    };

    const handleInputChange = (itemID, field, value) => {
        const updatedItems = quotationItems.map(item => {
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
              onChange={(e) => handleInputChange(item.itemID, "name", e.target.value)}
            />
          </td>
          <td>
            <FormControl
              type="number"
              value={item.quantity}
              onChange={(e) => handleInputChange(item.itemID, "quantity", parseFloat(e.target.value))}
            />
          </td>
          <td>
            <FormControl
              type="number"
              value={item.unitPrice}
              onChange={(e) => handleInputChange(item.itemID, "unitPrice", parseFloat(e.target.value))}
            />
          </td>
          <td>{item.totalPrice}</td>
          <td>
            <Button variant="danger" onClick={() => handleRemoveItem(item.itemID)}>
              Remove
            </Button>
          </td>
        </tr>
      );
    });

    const finalPrice = quotationItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    return (
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header className="w-100" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Quotations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button onClick={props.onHide}>Decline Quotation</Button>
          <Button>Accept Quotation</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default OrderDetailManager;
