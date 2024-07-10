import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { jwtDecode } from "jwt-decode";

function UserInfo() {
  const [dobError, setDobError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState();
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [ role,  setRole] = useState("");
  const [ status, setStatus] = useState("");
  const [ dateCreated, setDateCreated] = useState("");
  const { token } = useAuth();
  let account = {
    email,
    password,
    dateCreated,
    userInfo: {
      firstName,
      lastName,
      birthDate,
      gender,
      phoneNumber,
      address,
    },
    role,
    status,
  };

  console.log(account);

  useEffect(() => {
    getData();
  }, []);

  let decodedToken;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const getData = () => {
    if (token) {
      axios(`${ServerUrl}/api/account/${decodedToken.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (res.status === 200) {
            let account = res.data.responseList.account;

            setEmail(account.email);
            setPassword(account.password);
            setFirstName(account.userInfo.firstName);
            setLastName(account.userInfo.lastName);
            const dateObject = new Date(
              account.userInfo.birthDate[0],
              account.userInfo.birthDate[1] - 1,
              account.userInfo.birthDate[2] + 1
            );
            const isoString = dateObject.toISOString();
            const formattedDate = isoString.substring(0, 10);
            setBirthDate(formattedDate);
            setGender(account.userInfo.gender);
            setPhoneNumber(account.userInfo.phoneNumber);
            setAddress(account.userInfo.address);
            setRole(account.role);
            setStatus(account.status);
            setDateCreated(account.dateCreated);
          } else if (res.status === 400) {
            throw new Error(res.message);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  const validateDob = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();
    const dayDifference = today.getDate() - dobDate.getDate();

    if (
      age > 18 ||
      (age === 18 && monthDifference > 0) ||
      (age === 18 && monthDifference === 0 && dayDifference >= 0)
    ) {
      setDobError("");
      return true;
    } else {
      setDobError("You must be at least 18 years old.");
      return false;
    }
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    const formValid = form.checkValidity();
    const dobValid = validateDob(form.elements.dob.value);

    if (!formValid || !dobValid) {
      e.stopPropagation();
    } else {
      console.log(account);
      axios(`${ServerUrl}/api/account/${decodedToken.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: account.userInfo,
      })
        .then((response) => {
          if (response.status === 200) {
            alert("Update successful");
            getData();
          } else if (response.status === 400) {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          alert(error);
          console.log("There is an error: " + error);
        });
    }
  };

  return (
    <div className="w-75 h-100" style={{ paddingTop: "5%" }}>
      <div style={{ paddingBottom: "50px" }}>
        <h1 className="fw-bold">Profile</h1>
      </div>
      <div>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group>
              <Form.Control type="text" hidden value={email} name="email" />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                hidden
                value={password}
                name="password"
              />
            </Form.Group>
            <Col>
              <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  name="firstName"
                  style={{ borderColor: "#000" }}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a first name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  name="lastName"
                  style={{ borderColor: "#000" }}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a last name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Date of birth:</Form.Label>
            <Form.Control
              required
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              name="dob"
              style={{ borderColor: "#000" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a date of birth.
            </Form.Control.Feedback>
            {dobError && (
              <Alert variant="danger" className="mt-2">
                {dobError}
              </Alert>
            )}
          </Form.Group>
          <Form.Group className="d-flex flex-row align-items-center justify-items-center">
            <Form.Label>Gender:</Form.Label>
            <div
              className="d-flex align-items-center"
              style={{ marginLeft: "10px", marginBottom: "3px" }}
            >
              <Form.Check
                required
                type="radio"
                label="Male"
                name="gender"
                value="MALE"
                onChange={(e) => setGender("MALE")}
                className="me-3"
                checked={gender === "MALE" ? true : false}
              />
              <Form.Check
                required
                type="radio"
                label="Female"
                name="gender"
                value="FEMALE"
                onChange={(e) => setGender("FEMALE")}
                checked={gender === "FEMALE" ? true : false}
              />
            </div>
            <Form.Control.Feedback type="invalid" className="ms-3">
              Please select a gender.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 mt-3">
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              required
              type="tel"
              pattern="[0-9]{10}"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ borderColor: "#000" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid phone number (10 digits).
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              required
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ borderColor: "#000" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an address.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="pt-3">
            <Button style={{ width: "80px" }} type="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default UserInfo;
