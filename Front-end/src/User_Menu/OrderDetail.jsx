import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ServerUrl from "../reusable/ServerUrl";
import {
  Badge,
  Button,
  Col,
  Row,
  Table,
} from "react-bootstrap";
import snowfall from "../assets/snowfall.jpg";
import QuotationModal from "./order_detail_components/QuotationModal";
import WarrantyCertificateModal from "../warranty/WarrantyCertificateModal";
import AssignedStaff from "./order_detail_components/AssignedStaff";
import ProductSpecificationTable from "./order_detail_components/ProductSpecification";
import { useAuth } from "../provider/AuthProvider";
import CustomAlert from "../reusable/CustomAlert";
import ConfirmationModal from "../reusable/ConfirmationModal";

function OrderDetail() {
  const quotationQualified = [
    "QUO_AWAIT_CUST_APPROVAL",
    "AWAIT_TRANSACTION",
    "IN_DESIGNING",
    "DES_AWAIT_MANA_APPROVAL",
    "DES_AWAIT_CUST_APPROVAL",
    "IN_PRODUCTION",
    "PRO_AWAIT_APPROVAL",
    "ORDER_COMPLETED",
  ];
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState();
  const [showQuotation, setShowQuotation] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageLink, setImageLink] = useState(null);
  const [showAlert, setShowAlert] = useState(["", "", false, false, ""]);

  const id = location.state || searchParams.get('id');
  const status = searchParams.get('status');

  const arrayToDate = (date) => {
    if (date === null || date === 0) {
      return "Ongoing";
    }
    const dateObject1 = new Date(date[0], date[1] - 1, date[2] + 1);
    const isoString = dateObject1.toISOString();
    const formattedDate = isoString.substring(0, 10);
    return formattedDate;
  };

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

  useEffect(() => {
    if (status === "success") {
      setShowAlert(["Successfully make payment", "", true, false, "success"])
    } else if (status === "cancel") {
      setShowAlert(["Payment cancelled", "", true, false, "info"])
    }

    fetchData();
  }, [id]);

  if (!data) {
    // Handle loading state or error
    return <div>Loading...</div>;
  }

  console.log(data);

  const handleShowQuotations = () => {
    setShowQuotation(true);
  };

  const handleShowConfirmation = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    handleCancelOrder();
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(`${ServerUrl}/api/order/cancel/${id}`);
      if (response.status === 200) {
        const body = response.data.responseList;
        setData(body.orderDetail);
        setShowAlert([response.data.message, "", true, false, ""])
      } else {
        setShowAlert([response.data.message, "", true, false, ""])
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setShowAlert(["An error occurred while cancelling the order.", "", true, false, ""])
    }
  };

  return (
    <>
      <Row className="w-100">
        <Col
          md={8}
          style={{
            height: "100vh",
            overflowY: "auto",
            paddingTop: "1%",
            paddingBottom: "1%",
          }}
        >
          <div className="pb-2" style={imageContainerStyle}>
            <img src={imageLink} alt="Product" className="w-100 h-100" style={imageStyle}/>
          </div>
          <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
            <div className="p-3">
              <h4 className="pb-2">Order Id: {data.id}</h4>
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
                  <td>
                    {Math.round(data.quotation?.totalPrice) ||
                      "Dont have quotation yet"}
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <Badge
                      className="text-white"
                      bg={data.status === "ORDER_COMPLETED"? "success": data.status === "CANCEL"? "danger": "warning"}
                    >
                      {data.status}
                    </Badge>
                  </td>
                </tr>
              </Table>
            </div>
          </div>
        </Col>

        <Col
          md={4}
          style={{
            height: "100vh",
            overflowY: "auto",
          }}
        >
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
          {quotationQualified.includes(data.status) && (
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
          )}
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
          {!["ORDER_COMPLETED", "CANCEL"].includes(data.status) && (
            <Row className="mt-2">
              <Button variant="danger" onClick={handleShowConfirmation}>
                Cancel Order
              </Button>
            </Row>
          )}
        </Col>
      </Row>
      {data.quotation && (
        <QuotationModal
          data={data}
          quotation={data.quotation}
          orderId={data.id}
          show={showQuotation}
          onHide={() => setShowQuotation(false)}
          onQuotationChange={fetchData}
        />
      )}
      <WarrantyCertificateModal
        show={showWarranty}
        handleClose={() => setShowWarranty(false)}
      />

      {showAlert && showAlert[2] && (
        <CustomAlert
          title={showAlert[0]}
          text={showAlert[1]}
          isShow={showAlert[2]}
          onClose={showAlert[3]}
          alertVariant={showAlert[4]}
        />
      )}
      <ConfirmationModal
        show={showConfirm}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirm(false)}
        title="Confirm cancelation"
        body="Are you sure you want to cancel this order? This action cannot be undone."
      />
    </>
  );
}

const imageContainerStyle = {
  width: '500px',
  height: '500px',
  overflow: 'hidden',
  position: 'relative',
  margin: '0 auto',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

export default OrderDetail;
