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
  Row,
  Table,
} from "react-bootstrap";
import snowfall from "../assets/snowfall.jpg";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import ResizeImage from "../reusable/ResizeImage";
import CreateReport from "../orderFlows/CreateReport";
import AssignedStaff from "./AssignedStaff";
import QuotationModal from "./QuotationModal";
import CustomAlert from "../reusable/CustomAlert";

function OrderDetailManager() {
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
  const [alertText, setAlertText] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const orderDetail = response.data.responseList.orderDetail;
        setData(orderDetail);
        setImageLink(orderDetail.design?.designLink || snowfall);
        setAlertText("Confirmed Payment successfully");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setShowAlert(true);
    }
  };

  useEffect(() => {
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

  const handleShowQuotations = () => setShowQuotation(true);

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
        fetchData();
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
        fetchData();
        setImageLink(response.data.responseList.designUrl);
        setShowProductReport(true);
      }
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
            <div className="pb-2">
              <img
                src={imageLink || snowfall}
                alt="Product"
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
            {["SALE_STAFF", "ADMIN"].includes(decodedToken.role) && (
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
            {["SALE_STAFF", "ADMIN", "CUSTOMER", "MANAGER"].includes(decodedToken.role) && (
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
            )}
            {["DESIGN_STAFF", "ADMIN"].includes(decodedToken.role) && (
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
              <Row className="pb-2">
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
          </Col>
        </Row>
      </Container>

      <QuotationModal
        quotation={data.quotation}
        orderId={data.id}
        show={showQuotation}
        onHide={() => setShowQuotation(false)}
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


      {showAlert && (
        <CustomAlert
          text={alertText}
          isShow={showAlert}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

export default OrderDetailManager;
