import React, { useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

export default function SignUp() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false || password !== confirmPassword) {
      e.stopPropagation();
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
      } else {
        setError("");
      }
    } else {
      //Fetch Data in here
      axios({
        method: "POST",
        url: `${ServerUrl}/api/registration/register`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { email, password },
      })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("purpose", "register");
            localStorage.setItem("email", email);
            navigate("/otp");
          } else if (response.status === 400) {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          alert(error);
          console.log("There was an error: " + error);
        });
    }

    setValidated(true);
  };

  return (
    <Container
      style={{ height: "90vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className="position-relative p-4 rounded-4"
        style={{
          width: "35%",
          backgroundColor: "rgba(217, 217, 217, 0.7)",
        }}
      >
        <Link
          to="/login"
          className="position-absolute"
          style={{ top: "7%" }}
        >
          <RiArrowLeftLine size={30} color="black" />
        </Link>
        <h2 className="text-center mb-4">Sign up</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please confirm your password.
            </Form.Control.Feedback>
            {error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
          </Form.Group>
          <div className="d-flex justify-content-center mb-3">
            <Button type="submit" className="w-100">
              Sign up
            </Button>
          </div>
        </Form>
        {/* <div className="d-flex align-items-center my-3">
          <div style={{ flex: 1, height: "1px", backgroundColor: "#000" }} />
          <span className="mx-3 text-muted">Or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#000" }} />
        </div>
        <div className="d-flex justify-content-center mb-3">
          <Button
            variant="outline-dark"
            className="d-flex align-items-center me-2"
            style={{  padding: "5px 10px" }}
          >
            <FaGoogle size={20} />
          </Button>
          <Button
            variant="outline-dark"
            className="d-flex align-items-center ms-2"
            style={{  padding: "5px 10px" }}
          >
            <FaGithub size={20} />
          </Button> */}
        {/* </div> */}
      </div>
    </Container>
  );
}
