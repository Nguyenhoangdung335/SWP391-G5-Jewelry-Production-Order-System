import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

export default function ConfirmPassword() {
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleBack = () => {
    navigate("/otp");
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false || password !== confirmPassword) {
      e.preventDefault();
      e.stopPropagation();
      if (password !== confirmPassword) {
        setPasswordMatch(false);
      }
    } else {
      e.preventDefault();
      axios({
        method: "POST",
        url: `${ServerUrl}/api/registration/update-password`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { email, password },
      })
        .then((response) => {
          if (response.status === 200) {
            localStorage.removeItem("purpose");
            localStorage.removeItem("email");
            navigate("/login");
          } else if (response.status === "BAD REQUEST") {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          alert(error.message);
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
        <h2 className="text-center mb-4">Enter New Password</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Control
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border-1"
              style={{
                borderColor: "#000",
                borderRadius: 10,
                marginBottom: "20px",
              }}
              isInvalid={!passwordMatch}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a new password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              className="border-1"
              style={{ borderColor: "#000", borderRadius: 10 }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!passwordMatch}
            />
            <Form.Control.Feedback type="invalid">
              {password !== confirmPassword
                ? "Passwords do not match."
                : "Please confirm your new password."}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex flex-row justify-content-center gap-4">
            <Button
              type="button"
              onClick={handleBack}
              className="d-flex align-items-center border-1"
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
              className="d-flex align-items-center border-1"
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
