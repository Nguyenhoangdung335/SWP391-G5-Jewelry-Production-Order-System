import { Button, Col, Form, Row } from "react-bootstrap";

function UserInfo() {
  return (
    <div className="w-75 h-100" style={{ paddingTop: "5%" }}>
      <div style={{ paddingBottom: "50px" }}>
        <h1 className="fw-bold">Profile</h1>
      </div>
      <div>
        <Form noValidate>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  required
                  type="text"
                  // value={firstName}
                  // onChange={(e) => setFirstName(e.target.value)}
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
                  // value={lastName}
                  // onChange={(e) => setLastName(e.target.value)}
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
              // value={birthDate}
              // onChange={(e) => setBirthDate(e.target.value)}
              name="dob"
              style={{ borderColor: "#000" }}
            />
            {/* <Form.Control.Feedback type="invalid">
              Please provide a date of birth. */}
            {/* </Form.Control.Feedback>
            {dobError && (
              <Alert variant="danger" className="mt-2">
                {dobError}
              </Alert>
            )} */}
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
                // value="MALE"
                // onChange={(e) => setGender("MALE")}
                className="me-3"
              />
              <Form.Check
                required
                type="radio"
                label="Female"
                name="gender"
                // value="FEMALE"
                // onChange={(e) => setGender("FEMALE")}
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
              // value={phoneNumber}
              // onChange={(e) => setPhoneNumber(e.target.value)}
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
              // value={address}
              // onChange={(e) => setAddress(e.target.value)}
              style={{ borderColor: "#000" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an address.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="pt-3">
            <Button style={{width:"80px"}} type="submit">Save</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default UserInfo;
