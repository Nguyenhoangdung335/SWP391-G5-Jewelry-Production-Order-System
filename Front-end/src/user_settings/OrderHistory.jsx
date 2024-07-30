import React, {useEffect, useState} from "react";
import {Badge, Card, Col, Container, Row} from "react-bootstrap";
import {useAuth} from "../provider/AuthProvider";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import arrayToDate from "../reusable/ArrayToDate";
import {Link} from "react-router-dom";
import Loader from "../reusable/Loader";
import noImage from "../assets/no_image.jpg";

function OrderHistory() {
    const [data, setData] = useState([]);
    const {token} = useAuth();
    const [hover, setHover] = useState(false);
    const [hoverId, setHoverId] = useState();

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            axios(`${ServerUrl}/api/order/account/${decodedToken.id}`, {
                method: "GET",
                headers: {"Content-Type": "Application/json"},
            }).then((res) => setData(res.data.responseList.orders));
        }
    }, [token]);

    if (!data) {
        return (
            <Loader/>
        );
    }

    const getOrder = data.map((i) => {
        return (
            <Col className="p-4" md={4} key={i.id}>
                <Link
                    to="/user_setting_page/order_detail_page"
                    state={i.id}
                    className=" link-opacity-50-hover text-decoration-none"
                >
                    <Card
                        onMouseEnter={() => {
                            setHoverId(i.id);
                            setHover(true);
                        }}
                        onMouseLeave={() => {
                            setHoverId(null);
                            setHover(false);
                        }}
                        className=" link-opacity-50-hover"
                        style={{
                            transition: " transform 300ms ease-out ",
                            transform: hoverId === i.id ? "scale(1.02)" : "scale(1.00)",
                            width: "20rem",
                        }}
                    >
                        <Card.Img
                            className="rounded-0"
                            onError={(ev) => (ev.target.src = noImage)}
                            variant="top"
                            src={i.shownImageUrl || noImage}
                            alt="Order Image"
                        />
                        <Card.Body
                            className="position-sticky"
                            style={{
                                height: "100%",
                                transition: " height 100s linear ",
                            }}
                        >
                            <Card.Text>{i.id}</Card.Text>
                            <Card.Text>{arrayToDate(i.createdDate)}</Card.Text>
                            <Badge
                                bg={
                                    i.status === "ORDER_COMPLETED"
                                        ? "success"
                                        : i.status === "CANCEL"
                                            ? "danger"
                                            : "warning"
                                }
                            >
                                {i.status}
                            </Badge>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        );
    });

    return (
        <Container>
            {data.length === 0 ? (
                <Row className="d-flex justify-content-center align-items-center mt-5">
                    <Col xs="auto" className="text-center">
                        <h4>No orders found</h4>
                    </Col>
                </Row>
            ) : (
                <Row className="mt-4">{getOrder}</Row>
            )}
        </Container>
    );
}

export default OrderHistory;
