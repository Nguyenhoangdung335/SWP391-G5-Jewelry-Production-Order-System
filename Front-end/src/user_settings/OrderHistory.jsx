import { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { Link, useLocation } from "react-router-dom";
import snowfall from "../assets/snowfall.jpg";

function OrderHistory() {
  const [data, setData] = useState([]);
  const { token } = useAuth();
  const location = useLocation
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (token) {
      const status = searchParams.get('status');
      if (status === "success") 
        alert("Successfully make payment");
      else if (status === "cancel")
        alert("Payment cancelled")


      const decodedToken = jwtDecode(token);
      axios(`${ServerUrl}/api/order/account/${decodedToken.id}`, {
        method: "GET",
        headers: { "Content-Type": "Application/json" },
      }).then((res) => setData(res.data.responseList.orders));
    }
  }, [token]);

  console.log(data);

  if (!data) {
    // Handle loading state or error
    return <div>Loading...</div>;
  }

  const getOrder = data.map((i) => {
    return (
      <Col className="p-4" md={4} key={i.id}>
        <Link
          to="/user_setting_page/order_detail_page"
          state={i.id}
          className=" link-opacity-50-hover text-decoration-none"
        >
          <Card className=" link-opacity-50-hover" style={{ width: "20rem" }}>
            <Card.Img onError={(ev)=> ev.target.src=snowfall} variant="top" src={i.imageURL || snowfall} alt="Order Image" />
            <Card.Body>
              <Card.Title className="fw-semibold" style={{ height: "50px" }}>{i.name}</Card.Title>
              <Card.Text>{i.id}</Card.Text>
              <Card.Text>{i.budget} $</Card.Text>
              <Card.Text>{i.createdDate}</Card.Text>
              <Badge>{i.status}</Badge>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    );
  });

  return (
    <Container>
      <Row className="mt-4">{getOrder}</Row>
    </Container>
  );
}

export default OrderHistory;
