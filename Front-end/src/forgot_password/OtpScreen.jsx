import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiRefreshLine,
} from "react-icons/ri";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

export default function OtpScreen() {
  const [validated, setValidated] = useState(false);
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();

  const purpose = localStorage.getItem("purpose");
  const email = localStorage.getItem("email");

  const handleBack = () => {
    if (purpose === "reset_password") {
      navigate("/reset_password");
    } else if (purpose === "register") {
      navigate("/signup");
    }
  };
  console.log(email);

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      axios({
        method: "POST",
        url: `${ServerUrl}/api/registration/verify?otp=${otp}`,
        headers: { "Content-Type": "application/json", key: email },
      })
        .then((response) => {
          if (response.status === 200) {
            if (purpose === "reset_password") {
              navigate("/new_password");
            } else if (purpose === "register") {
              navigate("/info");
            }
          } else if (response.status === "BAD REQUEST")
            throw new Error(response.message);
        })
        .catch((error) => {
          alert(error);
          console.log("This request have an error" + error);
        });
    }
    setValidated(true);
  };

  const handleResend = () => {
    axios({
      method: "POST",
      url: `${ServerUrl}/api/registration/resend-otp`,
      headers: { "Content-Type": "application/json", key: email },
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Your OTP has been resent!!");
        } else if (response.status === "BAD REQUEST")
          throw new Error(response.message);
      })
      .catch((error) => {
        alert(error);
        console.log("This request have an error" + error);
      });
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
        <h2 className="text-center mb-4">Enter OTP</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <InputGroup className="mb-4">
            <Form.Control
              required
              type="text"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP"
              className="border-1"
              style={{ borderColor: "#000", borderRadius: "10px 0px 0px 10px" }}
            />
            <Button
              onClick={handleResend}
              title="Resend OTP"
              variant="outline-secondary"
              style={{ borderRadius: "0 10px 10px 0" }}
            >
              <RiRefreshLine size={20} />
            </Button>
            <Form.Control.Feedback type="invalid">
              Please enter a valid OTP.
            </Form.Control.Feedback>
          </InputGroup>
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
