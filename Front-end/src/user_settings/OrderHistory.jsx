import { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import arrayToDate from "../reusable/ArrayToDate";
import { Link } from "react-router-dom";
import snowfall from "../assets/snowfall.jpg";

function CardHover({ hover, children }) {
  return (
    <Card
      className=" link-opacity-50-hover"
      style={{
        transition: " transform 300ms ease-out ",
        transform: hover ? "scale(1.01)" : "scale(1.00)",
        width: "20rem",
      }}
    >
      {children}
    </Card>
  );
}

function OrderHistory() {
  const [data, setData] = useState([]);
  const { token } = useAuth();
  const location = useLocation;
  const searchParams = new URLSearchParams(location.search);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      axios(`${ServerUrl}/api/order/account/${decodedToken.id}`, {
        method: "GET",
        headers: { "Content-Type": "Application/json" },
      }).then((res) => setData(res.data.responseList.orders));
    }
  }, [token]);

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
          <CardHover hover={hover} className=" link-opacity-50-hover">
            <Card.Img
              className="rounded-0"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onError={(ev) => (ev.target.src = snowfall)}
              variant="top"
              src={i.imageURL || snowfall}
              alt="Order Image"
            />
            {hover && (
              <Card.Body
                className="position-sticky"
                style={{
                  height: "100%",
                  transition: " height 100s linear ",
                }}
              >
                <Card.Text>{i.id}</Card.Text>
                <Card.Text>{arrayToDate(i.createdDate)}</Card.Text>
                <Badge bg={i.status === "ORDER_COMPLETED"? "success": i.status === "CANCEL"? "danger": "warning"} >{i.status}</Badge>
              </Card.Body>
            )}
          </CardHover>
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
