import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ServerUrl from "../reusable/ServerUrl";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import noImage from "../assets/no_image.jpg";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import ResizeImage from "../reusable/ResizeImage";
import CreateReport from "../orderFlows/CreateReport";
import AssignedStaff from "../User_Menu/order_detail_components/AssignedStaff";
import QuotationModal from "../User_Menu/order_detail_components/QuotationModal";
import CustomAlert from "../reusable/CustomAlert";
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";
import { useAlert } from "../provider/AlertProvider";

function OrderDetailManager() {
  const {showAlert} = useAlert();
  const state = useLocation();
  const [data, setData] = useState(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showDesignReport, setShowDesignReport] = useState(false);
  const [showProductReport, setShowProductReport] = useState(false);
  const [designImage, setDesignImage] = useState(null);
  const id = state.state;
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);
  const [imageLink, setImageLink] = useState(null);
  const [confirmNotification, setConfirmNotification] = useState(null);
  const [startRender, setStartRender] = useState(true);

  const isQualifiedApproveSpecification = ["ADMIN", "MANAGER"].includes(decodedToken.role) && data?.status === "REQ_AWAIT_APPROVAL";
  const isQualifyApproving =
  ["ADMIN", "CUSTOMER", "MANAGER"].includes(decodedToken.role) &&
  (
    (decodedToken.role === "ADMIN" && ["AWAIT", "APPROVAL"].every(sub => data?.status.includes(sub))) ||
    (decodedToken.role === "CUSTOMER" && ["AWAIT", "APPROVAL", "CUST"].every(sub => data?.status.includes(sub))) ||
    (decodedToken.role === "MANAGER" && ["AWAIT", "APPROVAL", "MANA"].every(sub => data?.status.includes(sub)))
  );

  const fetchData = async () => {
    try {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const orderDetail = response.data.responseList.orderDetail;
        setData(orderDetail);
        setImageLink(orderDetail.design?.designLink || noImage);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      showAlert("Error fetching data", "", "danger");
    }
  };

  useEffect(() => {
    if (startRender) {
      console.log("Start fetching");
      fetchData();
      setStartRender(false);
    }
  }, [startRender]);

  useEffect(() => {
    if (isQualifiedApproveSpecification || isQualifyApproving) {
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
  }, [isQualifiedApproveSpecification, isQualifyApproving, data]);

  if (!data) {
    return <div className="d-flex justify-content-center align-items-center">Loading...</div>;
  }

  const arrayToDate = (date) => {
    if (!date) return "NaN";
    const dateObject1 = new Date(date[0], date[1] - 1, date[2]);
    const isoString = dateObject1.toISOString();
    return isoString.substring(0, 10);
  };

  const handleShowQuotations = () => setShowQuotation(true);

  const handleConfirmRequest = async (confirmed) => {
    if (isQualifyApproving || isQualifiedApproveSpecification) {
      const confirmedBool = Boolean(confirmed);
      const url = `${ServerUrl}/api/notifications/${data.id}/${confirmNotification.id}/confirm?confirmed=${confirmedBool}`;

      try {
        const response = await axios.post(url);
        if (response.status === 200) {
          showAlert("Confirm successfully", "", "success");
          setStartRender(true);
        }
      } catch (error) {
        showAlert("Confirm failed", "", "danger");
      }
    }
  };

  const handleDesignImageSubmit = async (e) => {
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
      if (response.status === 200) {
        setStartRender(true);
        setImageLink(response.data.responseList.designUrl);
        setShowDesignReport(true);
      }
    } else {
      console.error("designImage is not a File");
    }
  };

  const handleProductImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (designImage instanceof File) {
      const resizedImageFile = await ResizeImage(designImage);
      formData.append("file", resizedImageFile);
      const response = await axios.post(
        `${ServerUrl}/api/order/${data.id}/detail/edit-product`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        setStartRender(true);
        setImageLink(response.data.responseList.designUrl);
        setShowProductReport(true);
        showAlert("Upload Design image successfully", "", "success");
      }
    } else {
      showAlert("Upload design image failed", "", "danger");
    }
  };

  const handleStaffSubmit = async (updatedStaff) => {
    try {
      const response = await axios.post(
        `${ServerUrl}/api/order/${data.id}/detail/assign-staff`,
        updatedStaff
      );
      if (response.status === 200) {
        showAlert("Assigned Staff successfully", "", "success");
        setStartRender(true);
      }
    } catch (error) {
      showAlert("Assigned Staff failed", "", "danger");
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
      <Container style={{ overflowY: "hidden" }}>
        <Row>
          <Col
            md={8}
            style={{
              height: "100vh",
              overflowY: "auto",
              paddingTop: "1%",
              paddingBottom: "1%",
            }}
          >
            <div className="mb-3" style={imageContainerStyle}>
              <img
                src={imageLink || noImage}
                alt="Product"
                style={imageStyle}
              />
            </div>
            <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
              <div className="p-3">
                <h4 className="pb-2">{id}</h4>
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
                      <td>{data.completedDate ? arrayToDate(data.completedDate): "Ongoing"}</td>
                    </tr>
                    <tr>
                      <th>Total Price</th>
                      <td>{formatPrice(data.quotation?.totalPrice || 0)}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        <Badge className="text-white"
                          bg={
                            data.status === "ORDER_COMPLETED"? "success": "danger" }
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

          <Col
            md={4}
            style={{ height: "100vh", overflowY: "auto", paddingTop: "1%" }}
          >
            <Row className="mb-3">
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
                    <p className="text-lg-end">
                      {data.owner?.userInfo?.firstName || "NaN"}{" "}
                      {data.owner?.userInfo?.lastName || "NaN"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Phone Number:</h6>
                    <p className="text-lg-end">
                      {data.owner?.userInfo?.phoneNumber || "NaN"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Address</h6>
                    <p className="text-lg-end">
                      {data.owner?.userInfo?.address || "NaN"}
                    </p>
                  </div>
                </div>
              </div>
            </Row>
            {data && (
              <Row className="mb-3">
                <AssignedStaff
                  decodedToken={decodedToken}
                  data={data}
                  onSubmit={handleStaffSubmit}
                />
              </Row>
            )}
            <Row className="mb-3">
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
                  <ProductSpecificationTable orderStatus={data?.status} selectedProduct={data?.product} role ={decodedToken.role}/>
                  {isQualifiedApproveSpecification && (
                    <div className="d-flex justify-content-center pt-2 gap-5">
                      <Button className="w-50" onClick={() => handleConfirmRequest(false)}>
                       Declined
                      </Button>
                      <Button className="w-50" onClick={() => handleConfirmRequest(true)}>
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Row>
            {["SALE_STAFF", "MANAGER", "ADMIN"].includes(decodedToken.role) && (
              <Row className="mb-3">
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
                      </div>
                    </div>
                    <div className="d-flex justify-content-center pt-2">
                      <Button className="w-100" onClick={handleShowQuotations}>
                        Show Quotations
                      </Button>
                    </div>
                  </div>
                </div>
              </Row>
            )}
            {/* {["SALE_STAFF", "ADMIN", "CUSTOMER", "MANAGER"].includes(decodedToken.role) && (
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
            )} */}
            {["DESIGN_STAFF", "ADMIN"].includes(decodedToken.role) && (
              <Row className="mb-3">
                <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                  <div className="p-2">
                    <div
                      className="mb-2"
                      style={{
                        borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                      }}
                    >
                      <h4>Upload Design Image</h4>
                    </div>
                    <Form noValidate onSubmit={handleDesignImageSubmit}>
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
            )}
            {["PRODUCTION_STAFF", "ADMIN"].includes(decodedToken.role) && (
              <Row className="mb-3">
                <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
                  <div className="p-2">
                    <div
                      className="mb-2"
                      style={{
                        borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
                      }}
                    >
                      <h4>Upload Final Product</h4>
                    </div>
                    <Form noValidate onSubmit={handleProductImageSubmit}>
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
                    <Form>
                      <div className="d-flex justify-content-center pt-2 gap-5">
                        <Button className="w-50" onClick={() => handleConfirmRequest(false)}>
                          Declined
                        </Button>
                        <Button className="w-50" onClick={() => handleConfirmRequest(true)}>
                          Approve
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

      <QuotationModal
        data={data}
        quotation={data.quotation}
        orderId={data.id}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
        setShowAlert={handleSetAlertInfo}
        fetchData={() => setStartRender(true)}
      />

      {showDesignReport && data.design && (
        <CreateReport
          reportContentId={data?.design?.id}
          orderId={data.id}
          reportType="DESIGN"
          onHide={() => setShowDesignReport(false)}
        />
      )}

      {showProductReport && data.design && (
        <CreateReport
          reportContentId={data?.design?.id}
          orderId={data.id}
          reportType="FINISHED_PRODUCT"
          onHide={() => setShowProductReport(false)}
        />
      )}


      {showAlert && showAlert[2] && (
        <CustomAlert
          title={showAlert[0]}
          text={showAlert[1]}
          isShow={showAlert[2]}
          onClose={showAlert[3]}
          alertVariant={showAlert[4]}
        />
      )}
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

const formatPrice = (price) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export default OrderDetailManager;
