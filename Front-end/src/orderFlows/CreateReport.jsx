import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import serverUrl from "../reusable/ServerUrl";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { Form, Button, Modal } from "react-bootstrap";
import { useAlert } from "../provider/AlertProvider";

function CreateReport({ header = "Request Form", reportContentId, orderId, reportType, onHide, fetchData }) {
  const {showAlert} = useAlert();
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = {
      title,
      description,
      type: reportType,
      senderId: decodedToken.id,
      reportContentID: reportContentId,
    };

    const url = () => {
      if (reportType === "QUOTATION")
        return `${serverUrl}/api/report/${decodedToken.id}/${orderId}/create/quote`;
      else if (reportType === "DESIGN")
        return `${serverUrl}/api/report/${decodedToken.id}/${orderId}/create/design`;
      else if (reportType === "FINISHED_PRODUCT")
        return `${serverUrl}/api/report/${decodedToken.id}/${orderId}/create/product`
      else
        return `${serverUrl}/api/report/${decodedToken.id}/${reportContentId}/create/request`;
    };

    axios
      .post(url(), request)
      .then((response) => {
        onHide();
        if (response.status === 200) {
          showAlert(response.data.message, "", "success");
          fetchData();
        } else {
          const errors = Object.entries(response.data.responseList);
          showAlert(response.data.message, errors.map(([key, value]) => (key + ": " + value + "\n")), "warning", 5000);
        }
      })
      .catch((error) => {
        console.error("There was an error sending the request!", error);
        showAlert("Submit Request Failed", "", "error");
      });
  };

  if (requestSent) {
    return <Navigate to="/" />;
  }

  return (
    <Modal
      show={true}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation
      backdrop="static"
    >
      <Modal.Header className="w-100" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {header}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{width: "100%"}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={true}
              style={{ width: "100%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
              style={{ width: "100%" }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" >
            Confirm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateReport;
