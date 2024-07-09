import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ServerUrl from "../../reusable/ServerUrl";
import { Col, Container, Row, Table } from "react-bootstrap";

function OrderDetail() {
  const state = useLocation();
  const [data, setData] = useState();
  const id = state.state;

  useEffect(() => {
    axios(`${ServerUrl}/api/order/${id}/detail`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => setData(res.data.responseList.orderDetail));
  }, [state]);

  if (!data) {
    // Handle loading state or error
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <Container>
      <Row className="pt-4 pb-4">
        <Col md={8}>
          <h4 className="pb-2">Order Items</h4>
          <Table striped bordered hover>
            <thead>
              <th>Material</th>
              <th>Price</th>
              <th>QTY</th>
              <th>Total</th>
            </thead>
          </Table>
        </Col>
        <Col md={4}>
          <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
            <div className="p-2">
              <div className="mb-2" style={{ borderBottom: "1px solid rgba(166, 166, 166, 0.5) " }}>
                <h4>Customer</h4>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Name: </h6>
                <p>
                  {data.owner.userInfo.firstName} {data.owner.userInfo.lastName}
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Phone Number: </h6>
                <p>{data.owner.userInfo.phoneNumber}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Address</h6>
                <p>{data.owner.userInfo.address}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col md={8}>
          <h4 className="pb-2">Transactions</h4>
          <Table striped bordered hover>
            <thead>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </thead>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderDetail;
