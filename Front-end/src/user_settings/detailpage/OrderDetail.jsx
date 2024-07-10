import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ServerUrl from "../../reusable/ServerUrl";
import { Badge, Col, Container, Row, Table } from "react-bootstrap";
import snowfall from "../../assets/snowfall.jpg";

function OrderDetail() {
  const state = useLocation();
  const [data, setData] = useState();
  const id = state.state;

  const arrayToDate = (date) => {
    const dateObject1 = new Date(date[0], date[1] - 1, date[2] + 1);
    const isoString = dateObject1.toISOString();
    const formattedDate = isoString.substring(0, 10);

    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${ServerUrl}/api/order/${id}/detail`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setData(response.data.responseList.orderDetail);
      }
    };
    fetchData();
  }, [state]);

  if (!data) {
    // Handle loading state or error
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <Container className="pt-4 pb-4">
      <Row>
        <Col md={8}>
          <div className="pb-2">
            <img src={snowfall} alt="Product Image" className="w-100 h-100" />
          </div>
          <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
            <div className="p-3">
              <h4 className="pb-2">Order Id: {id}</h4>
              <Table bordered hover>
                <tr>
                  <th>Id</th>
                  <td>{data.product.id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{data.product.name}</td>
                </tr>
                <tr>
                  <th>Created Date</th>
                  <td>{arrayToDate(data.createdDate)}</td>
                </tr>
                <tr>
                  <th>Completed Date</th>
                  <td>{arrayToDate(data.createdDate)}</td>
                </tr>
                <tr>
                  <th>Total Price</th>
                  <td>{data.quotation.totalPrice}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <Badge
                      className="text-center"
                      bg={
                        data.status === "ORDER_COMPLETED" ? "success" : "danger"
                      }
                    >
                      {data.status}
                    </Badge>
                  </td>
                </tr>
              </Table>
            </div>
          </div>
        </Col>

        <Col md={4}>
          <Row className="pb-2">
            <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
              <div className="p-2">
                <div
                  className="mb-2"
                  style={{
                    borderBottom: "1px solid rgba(166, 166, 166, 0.5) ",
                  }}
                >
                  <h4>Customer</h4>
                </div>
                <div className="d-flex justify-content-between">
                  <h6>Name: </h6>
                  <p>
                    {data.owner.userInfo.firstName}{" "}
                    {data.owner.userInfo.lastName}
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
          </Row>
          <Row>
            <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
              <div className="p-2">
                <div
                  className="mb-2"
                  style={{
                    borderBottom: "1px solid rgba(166, 166, 166, 0.5) ",
                  }}
                >
                  <h4>Specification</h4>
                  <div style={{ overflow: "scroll", height: "57vh" }}>
                    <Table bordered hover>
                      <tr>
                        <th>Id</th>
                        <td>{data.product.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{data.product.name}</td>
                      </tr>
                      <tr>
                        <th>Created Date</th>
                        <td>{arrayToDate(data.createdDate)}</td>
                      </tr>
                      <tr>
                        <th>Completed Date</th>
                        <td>{arrayToDate(data.createdDate)}</td>
                      </tr>
                      <tr>
                        <th>Total Price</th>
                        <td>{data.quotation.totalPrice}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <Badge
                            className="text-center"
                            bg={
                              data.status === "ORDER_COMPLETED"
                                ? "success"
                                : "danger"
                            }
                          >
                            {data.status}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <th>Id</th>
                        <td>{data.product.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{data.product.name}</td>
                      </tr>
                      <tr>
                        <th>Created Date</th>
                        <td>{arrayToDate(data.createdDate)}</td>
                      </tr>
                      <tr>
                        <th>Completed Date</th>
                        <td>{arrayToDate(data.createdDate)}</td>
                      </tr>
                      <tr>
                        <th>Total Price</th>
                        <td>{data.quotation.totalPrice}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <Badge
                            className="text-center"
                            bg={
                              data.status === "ORDER_COMPLETED"
                                ? "success"
                                : "danger"
                            }
                          >
                            {data.status}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <th>Id</th>
                        <td>{data.product.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{data.product.name}</td>
                      </tr>
                      <tr>
                        <th>Created Date</th>
                        <td>{arrayToDate(data.createdDate)}</td>
                      </tr>
                      <tr>
                        <th>Completed Date</th>
                        <td>{arrayToDate(data.createdDate)}</td>
                      </tr>
                      <tr>
                        <th>Total Price</th>
                        <td>{data.quotation.totalPrice}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <Badge
                            className="text-center"
                            bg={
                              data.status === "ORDER_COMPLETED"
                                ? "success"
                                : "danger"
                            }
                          >
                            {data.status}
                          </Badge>
                        </td>
                      </tr>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderDetail;
