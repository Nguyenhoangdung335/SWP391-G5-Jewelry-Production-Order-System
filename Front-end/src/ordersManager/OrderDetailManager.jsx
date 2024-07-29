import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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
import ProductSpecificationTable from "../User_Menu/order_detail_components/ProductSpecification";
import { useAlert } from "../provider/AlertProvider";
import Loader from "../reusable/Loader";

function OrderDetailManager() {
  const { showAlert } = useAlert();
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
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [reportContentId, setReportContentId] = useState();

  const isQualifiedApproveSpecification =
    ["ADMIN", "MANAGER"].includes(decodedToken.role) &&
    data?.status === "REQ_AWAIT_APPROVAL";
  const isQualifyApproving =
    ["ADMIN", "MANAGER"].includes(decodedToken.role) &&
    ((decodedToken.role === "ADMIN" &&
      ["AWAIT", "APPROVAL"].every((sub) => data?.status.includes(sub))) ||
      (decodedToken.role === "MANAGER" &&
        data?.status === "DES_AWAIT_MANA_APPROVAL"));

  const fetchData = useCallback(async () => {
    try {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const orderDetail = response.data.responseList.orderDetail;
        setData(orderDetail);
        setImageLink(orderDetail.shownImageUrl);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      showAlert("Error fetching data", "", "danger");
    }
  }, [id]);

  useEffect(() => {
    if (startRender) {
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

  if (!data || data === undefined) {
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        Loading...
      </div>
    );
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
    setButtonIsLoading(true);
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
        setImageLink(response.data.responseList.designUrl);
        setReportContentId(response.data.responseList.designId)
        setShowDesignReport(true);
        setButtonIsLoading(false);
        showAlert("Upload Design Image successfully", "", "success");
      } else {
        showAlert("Upload Design Image failed", "", "danger");
      }
    } else {
      showAlert("Upload Design Image failed", "", "danger");
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
        setImageLink(response.data.responseList.productUrl);
        setReportContentId(response.data.responseList.productId);
        setShowProductReport(true);
        showAlert("Upload Product Proof successfully", "", "success");
      } else {
        showAlert("Upload Product Proof failed", "", "danger");
      }
    } else {
      showAlert("Upload Product Proof failed", "", "danger");
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
      } else {
        showAlert("Assigned Staff failed", response.data.message, "danger");
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
                      <td>{data?.id || "NaN"}</td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>{data?.name || "NaN"}</td>
                    </tr>
                    <tr>
                      <th>Created Date</th>
                      <td>{arrayToDate(data.createdDate)}</td>
                    </tr>
                    <tr>
                      <th>Completed Date</th>
                      <td>
                        {data.completedDate
                          ? arrayToDate(data.completedDate)
                          : "Ongoing"}
                      </td>
                    </tr>
                    <tr>
                      <th>Total Price</th>
                      <td>{formatPrice(data.quotation?.finalPrice || 0)}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        {data.fromTemplate && (
                          <Badge
                            className="text-white"
                            bg="info"
                          >
                            From template
                          </Badge>
                        )}
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
                  <ProductSpecificationTable
                    orderStatus={data?.status}
                    selectedProduct={data?.product}
                    role={decodedToken.role}
                    fetchData={fetchData}
                  />
                  {isQualifiedApproveSpecification && (
                    <div className="d-flex justify-content-center pt-2 gap-5">
                      <Button
                        className="w-50"
                        onClick={() => handleConfirmRequest(false)}
                      >
                        Declined
                      </Button>
                      <Button
                        className="w-50"
                        onClick={() => handleConfirmRequest(true)}
                      >
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
                    <Form noValidate>
                      <Form.Control
                        type="file"
                        name="designImage"
                        accept="image/png, image/gif, image/jpeg, image/jpg"
                        onChange={(e) => setDesignImage(e.target.files[0])}
                      />
                      <div className="d-flex justify-content-end">
                        <Button type="submit" className="mt-2 mb-2"
                          onClick={buttonIsLoading? null: handleDesignImageSubmit}
                          disabled={buttonIsLoading}
                        >
                          {buttonIsLoading ? "Loading..." : "Submit design"}
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
                      <h4>
                        Approve{" "}
                        {data.status.includes("DES")
                          ? "Design Request"
                          : "Final Product Proof"}
                      </h4>
                    </div>
                    <Form>
                      <div className="d-flex justify-content-center pt-2 gap-5">
                        <Button
                          className="w-50"
                          onClick={() => handleConfirmRequest(false)}
                        >
                          Declined
                        </Button>
                        <Button
                          className="w-50"
                          onClick={() => handleConfirmRequest(true)}
                        >
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
        passedQuotation={data.quotation}
        orderId={data.id}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
        fetchData={() => setStartRender(true)}
      />

      {showDesignReport && reportContentId && (
        <CreateReport
          header="Submit Design Report"
          reportContentId={reportContentId}
          orderId={data.id}
          reportType="DESIGN"
          onHide={() => setShowDesignReport(false)}
          fetchData={() => setStartRender(true)}
        />
      )}

      {showProductReport && reportContentId && (
        <CreateReport
          header="Submit Finished Product Report"
          reportContentId={reportContentId}
          orderId={data.id}
          reportType="FINISHED_PRODUCT"
          onHide={() => setShowProductReport(false)}
          fetchData={() => setStartRender(true)}
        />
      )}
    </>
  );
}

const imageContainerStyle = {
  width: "100%",
  height: "auto",
  overflow: "hidden",
  position: "relative",
  margin: "0 auto",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const formatPrice = (price) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export default OrderDetailManager;
