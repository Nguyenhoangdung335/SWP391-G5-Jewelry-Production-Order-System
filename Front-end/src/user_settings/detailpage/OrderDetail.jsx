import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ServerUrl from "../../reusable/ServerUrl";
import {
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import snowfall from "../../assets/snowfall.jpg";
import { jwtDecode } from "jwt-decode";

function OrderDetail() {
  const state = useLocation();
  const [data, setData] = useState();
  const [showQuotation, setShowQuotation] = useState(false);
  const [imageLink, setImageLink] = useState(null);
  const id = state.state;

  const arrayToDate = (date) => {
    const dateObject1 = new Date(date[0], date[1] - 1, date[2] + 1);
    const isoString = dateObject1.toISOString();
    const formattedDate = isoString.substring(0, 10);

    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const orderDetail = response.data.responseList.orderDetail;
        setData(orderDetail);
        setImageLink(orderDetail.design?.designLink || snowfall);
      }
    };
    fetchData();
  }, [state]);

  if (!data) {
    // Handle loading state or error
    return <div>Loading...</div>;
  }

  console.log(data);

  const handleClose = () => setShowQuotation(false);
  const handleShowQuotations = () => {
    setShowQuotation(true);
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
                    <th>Sale Staff</th>
                    <td>{data.saleStaff}</td>
                  </tr>
                  <tr>
                    <th>Design Staff</th>
                    <td>{data.designStaff}</td>
                  </tr>
                  <tr>
                    <th>Production Staff</th>
                    <td>{data.productionStaff}</td>
                  </tr>
                  <tr>
                    <th>Total Price</th>
                    <td>{data.quotation?.totalPrice || "Dont have quotation yet"}</td>
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
          </Col>
        </Row>
      </Container>

      {data.quotation && (<MyVerticallyCenteredModal
        quotation={data.quotation}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
      />)
      }
    </>
  );
}

function MyVerticallyCenteredModal(props) {
  const quotationItems = props.quotation.quotationItems;
  console.log(quotationItems);
  const getQuotationItems = quotationItems.map((item) => {
    return (
      <>
        <tr key={item.itemID}>
          <td>{item.itemID}</td>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.unitPrice}</td>
          <td>{item.totalPrice}</td>
        </tr>
      </>
    );
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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
            </tr>
          </thead>
          <tbody>
            {getQuotationItems}
            <tr>
              <td colSpan={4}>Final Price</td>
              <td>{props.quotation.totalPrice}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Decline Quotation</Button>
        <Button>Accept Quotation</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderDetail;
