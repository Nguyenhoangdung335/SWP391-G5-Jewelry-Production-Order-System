import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ServerUrl from "../reusable/ServerUrl";
import {
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import snowfall from "../assets/snowfall.jpg"
import QuotationModal from "./order_detail_components/QuotationModal";
import WarrantyCertificateModal from "../warranty/WarrantyCertificateModal";
import AssignedStaff from "./order_detail_components/AssignedStaff";
import ProductSpecificationTable from "./order_detail_components/ProductSpecification";
import { useAuth } from "../provider/AuthProvider";

function OrderDetail() {
  const quotationQualified = ["AWAIT_TRANSACTION", "IN_DESIGNING", "DES_AWAIT_MANA_APPROVAL", "DES_AWAIT_CUST_APPROVAL", "IN_PRODUCTION", "PRO_AWAIT_APPROVAL", "ORDER_COMPLETED"];
  const state = useLocation();
  const [data, setData] = useState();
  const [showQuotation, setShowQuotation] = useState(false);
  const id = state.state;
  const [showWarranty, setShowWarranty] = useState(false);
  const [imageLink, setImageLink] = useState(null);

  const arrayToDate = (date) => {
    if(date===null || date===0){
      return "Ongoing";
    }
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

  // const handleShowPayment = () => {
  //   setShowPayment(true);
  // };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(`${ServerUrl}/api/order/cancel/${id}`);
      if (response.status === 200) {
        alert("Order cancelled successfully.");
        // Optionally, you can redirect or update the UI to reflect the cancellation
      } else {
        alert("Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling the order.");
    }
  };

  return (
    <>
        <Row>
          <Col md={8} style={{
              height: "100vh",
              overflowY: "auto",
              paddingTop: "1%",
              paddingBottom: "1%",
            }}>
            <div className="pb-2">
              <img
                src={imageLink}
                alt="Product"
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
                    <td>{arrayToDate(data.completedDate)}</td>
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

          <Col md={4} style={{
              height: "100vh", overflowY: "auto"
            }}>
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
              <AssignedStaff data={data} />
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
                    <ProductSpecificationTable selectedProduct={data.product} />
                </div>
              </div>
            </Row>
            {quotationQualified.includes(data.status) && <Row className="pb-2">
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
            </Row>}
            <Row>
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <h4 style={{ display: "inline-block" }}>Warranty</h4>
                      <Button onClick={() => setShowWarranty(true)}>
                        Show Warranty
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
            <Row className="mt-2">
              <Button variant="danger" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            </Row>
          </Col>
        </Row>
      {data.quotation && (<QuotationModal
        quotation={data.quotation}
        orderId={data.id}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
      />)
      }
      <WarrantyCertificateModal show={showWarranty} handleClose={() => setShowWarranty(false)} />
    </>
  );
}


export default OrderDetail;
