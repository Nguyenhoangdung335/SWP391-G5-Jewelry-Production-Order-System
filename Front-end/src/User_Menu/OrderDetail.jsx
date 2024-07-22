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
  Spinner,
} from "react-bootstrap";
import noImage from "../assets/no_image.jpg";
import QuotationModal from "./order_detail_components/QuotationModal";
import WarrantyCertificateModal from "../warranty/WarrantyCertificateModal";
import AssignedStaff from "./order_detail_components/AssignedStaff";
import ProductSpecificationTable from "./order_detail_components/ProductSpecification";
import CustomAlert from "../reusable/CustomAlert";
import ConfirmationModal from "../reusable/ConfirmationModal";
import { useAlert } from "../provider/AlertProvider";
import Loader from "../reusable/Loader";

function OrderDetail() {
  const quotationQualified = [
    "QUO_AWAIT_CUST_APPROVAL",
    "AWAIT_BET_TRANSACTION",
    "IN_DESIGNING",
    "DES_AWAIT_MANA_APPROVAL",
    "DES_AWAIT_CUST_APPROVAL",
    "IN_PRODUCTION",
    "PRO_AWAIT_APPROVAL",
    "AWAIT_REMAIN_TRANSACTION",
    "ORDER_COMPLETED",
  ];

  const { showAlert } = useAlert();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState();
  const [showQuotation, setShowQuotation] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageLink, setImageLink] = useState(null);
  const [confirmNotification, setConfirmNotification] = useState(null);

  const id = location.state || searchParams.get('id');
  const status = searchParams.get('status');

  const isQualifyApproving = ["DES_AWAIT_CUST_APPROVAL", "PRO_AWAIT_APPROVAL"].includes(data?.status);
  const isQualifyTransaction = ["AWAIT_BET_TRANSACTION", "AWAIT_REMAIN_TRANSACTION"].includes(data?.status);

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
    try {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const orderDetail = response.data.responseList.orderDetail;
        setData(orderDetail);
        setImageLink(orderDetail.product.imageURL ? orderDetail.product.imageURL : (orderDetail.design?.designLink || noImage) );
      }
    } catch (error) {
      console.error("Error fetching data", error);
      showAlert("Error fetching data", "", "danger");
    }
  };

  useEffect(() => {
    if (status === "success") {
      showAlert("Successfully make payment", "", "success");
      searchParams.delete('status');
    } else if (status === "cancel") {
      showAlert("Payment cancelled", "", "info");
      searchParams.delete('status');
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (isQualifyApproving) {
      axios
        .get(`${ServerUrl}/api/notifications/${data.id}/get-confirm`)
        .then((res) => {
          if (res.status === 200) {
            setConfirmNotification(res.data.responseList.notification);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isQualifyApproving, data]);

  if (!data) {
    return (
      <Loader/>
    );
  }

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
        showAlert(response.data.message, "", "success");
      } else {
        showAlert([response.data.message, "", true, false, "error"]);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showAlert("An error occurred while cancelling the order.", "", "error");
    }
  };

  const handleSetAlertInfo = (alertInfo) => {
    showAlert(alertInfo);
  };

  const handleConfirmRequest = async (confirmed) => {
    if (isQualifyApproving) {
      const confirmedBool = Boolean(confirmed);
      const url = `${ServerUrl}/api/notifications/${data.id}/${confirmNotification.id}/confirm?confirmed=${confirmedBool}`;

      try {
        const response = await axios.post(url);
        if (response.status === 200) {
          showAlert("Confirm successfully", "", "success");
          fetchData();
        }
      } catch (error) {
        showAlert("Confirm failed", "", true, false, "danger");
      }
    }
  };

  const handleMakePayment = async (ev) => {
    setButtonIsLoading(true);

    const resultURL = `${window.location.href}?id=${data.id}`;
    try {
      const response = await axios.post(
        `${ServerUrl}/api/payment/create/${data.id}?quotationId=${data.quotation.id}&resultURL=${resultURL}`
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
                  <td>{data.product.id || "NaN"}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{data.product.name || "NaN"}</td>
                </tr>
                <tr>
                  <th>Created Date</th>
                  <td>{arrayToDate(data.createdDate)}</td>
                </tr>
                <tr>
                  <th>Completed Date</th>
                  <td>{data.completedDate? arrayToDate(data.completedDate): "Ongoing"}</td>
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
                    <Badge className="text-white"
                      bg={data.status === "ORDER_COMPLETED"? "success": "danger" }
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
          {data.status === "ORDER_COMPLETED" && (<Row>
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
          )}
          {isQualifyApproving && (
            <Row className="mb-3">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <h4>Approve {data.status.includes("DES")? "Design Request": "Final Product Proof"}</h4>
                  </div>
                    <div className="d-flex justify-content-center pt-2 gap-5">
                      <Button className="w-50" onClick={() => handleConfirmRequest(false)}>
                        Declined
                      </Button>
                      <Button className="w-50" onClick={() => handleConfirmRequest(true)}>
                        Approve
                      </Button>
                    </div>
                </div>
              </div>
            </Row>
          )}
          {isQualifyTransaction && (
            <Row className="mb-3">
              <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                <div className="p-2">
                  <div
                    className="mb-2"
                    style={{
                      borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                    }}
                  >
                    <h4>Make Payment</h4>
                  </div>
                    <div className="d-flex justify-content-center pt-2 gap-5">
                      <Button
                        className="w-100"
                        onClick={buttonIsLoading ? null: handleMakePayment}
                        disabled={buttonIsLoading}
                      >
                        {buttonIsLoading ? "Loading...": "Make Payment"}
                      </Button>
                    </div>
                </div>
              </div>
            </Row>
          )}
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
          setShowAlert={handleSetAlertInfo}
          fetchData={() => fetchData()}
        />
      )}
      <WarrantyCertificateModal
        data={data}
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
  width: '100%',
  height: 'auto',
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
