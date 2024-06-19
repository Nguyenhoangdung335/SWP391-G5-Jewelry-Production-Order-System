import React, { useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function ResetPassword() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  const handleNext = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      axios({
        method: "POST",
        url: "http://localhost:8080/api/registration/forget-password",
        headers: { "Content-Type": "application/json", key: email },
      })
        .then((response) => {
          if (response.status === 200) {
            navigate("/otp");
            localStorage.setItem("purpose", "reset_password");
            localStorage.setItem("email", email);
          } else if (response.status === "BAD REQUEST")
            throw new Error(response.message);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    }
    setValidated(true);
  };

  return (
    <Container
      style={{ paddingTop: "10%", paddingBottom: "10%" }}
      className="d-flex justify-content-center align-items-center py-32"
    >
      <div
        className="p-4"
        style={{
          width: "30%",
          backgroundColor: "rgba(217, 217, 217, 0.7)",
          borderRadius: 20,
        }}
      >
        <h2 className="text-center mb-4">Reset Password</h2>
        <Form noValidate validated={validated} onSubmit={handleNext}>
          <Form.Group className="mb-4">
            <Form.Control
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border-2"
              style={{ borderColor: "#000", borderRadius: 10 }}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex flex-row justify-content-center gap-4">
            <Button
              type="button"
              onClick={handleBack}
              className="d-flex align-items-center border-2"
              style={{
                backgroundColor: "rgba(201, 201, 201, 1)",
                borderColor: "#000",
                borderRadius: 10,
                color: "#000",
              }}
            >
              <RiArrowLeftLine size={20} /> <span className="ms-2">Back</span>
            </Button>
            <Button
              type="submit"
              className="d-flex align-items-center border-2"
              style={{
                backgroundColor: "rgba(201, 201, 201, 1)",
                borderColor: "#000",
                borderRadius: 10,
                color: "#000",
              }}
            >
              <span className="me-2">Next</span> <RiArrowRightLine size={20} />
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
