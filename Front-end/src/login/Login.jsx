import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

export default function Login() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  console.log(ServerUrl);

  //Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      //Send user's input to backend
      axios({
        method: "POST",
        url: `${ServerUrl}/api/registration/login`,
        headers: { "Content-Type": "application/json" },
        data: { email, password },
      })
        .then((response) => {
          if (response.status === 200) {
            setToken(response.data.responseList.token);
            navigate("/userManager");
          } else if (response.status === 400) {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          alert(error);
          console.error("There was an error!", error);
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
        className="p-4 rounded-4"
        style={{
          width: "35%",
          backgroundColor: "rgba(217, 217, 217, 0.7)",
        }}
      >
        <h2 className="text-center mb-4">Sign in</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              size="md"
              required
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formGroupPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              size="md"
              required
              type="password"
              placeholder=" Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
            <div className="text-end mt-1">
              <Link
                to="/reset_password"
                className="text-muted text-decoration-none"
              >
                Forget password
              </Link>
            </div>
          </Form.Group>
          <div className="d-flex justify-content-center mb-3">
            <Button type="submit" className="w-100">
              Sign in
            </Button>
          </div>
        </Form>
        {/* <div className="d-flex align-items-center my-3">
            <div style={{ flex: 1, height: "1px", backgroundColor: "#000" }} />
            <span className="mx-3 text-muted">Or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#000" }} />
          </div>
          <div className="d-flex justify-content-center border-1">
            <Button variant="outline-dark" className="mx-2">
              <FaGoogle />
            </Button>
            <Button variant="outline-dark" className="mx-2">
              <FaGithub />
            </Button>
          </div> */}
        <p className="text-center ">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none fw-bold text-muted"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  );
}
