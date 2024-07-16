import React, { useState } from "react";
import { Table, Button, Badge, Container, Row, Col } from "react-bootstrap";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoMdCart } from "react-icons/io";
import { LiaUser } from "react-icons/lia";
import { useEffect } from "react";
import LineChartComponent from "../chart/LineChart";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import ServerUrl from "../reusable/ServerUrl";

export default function DashboardManager() {
  const [currentPageClients, setCurrentPageClients] = useState(1);
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [order, setOrder] = useState([]);
  const [ dashboard, setDashboard ] = useState();
  // const [info, setInfo] = useState([]);
  const itemsPerPage = 5;
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    async function fetchOrder() {
      const userRole = decodedToken?.role;
      const accountId = decodedToken?.id;
      try {
        const response = await axios.get(`${ServerUrl}/api/admin/get/order/0`, {
        headers: { "Content-Type": "application/json" },
        params: {
          role: userRole,
          status: "ALL",
          accountId: accountId,
        },
        });
        if (response.status === 200) {
          setOrder(response.data.responseList.orders);
        } else {
          console.error("Failed to fetch orders:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrder();
    // async function fetchDashboard() {
    //   try {
    //     const response = await axios.get(`${ServerUrl}/api/admin/dashboard`);
    //     if (response.data.status === "OK") {
    //       setDashboard(response.data.responseList);
    //     } else {
    //       console.error("Failed to fetch orders:", response.data.message);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching orders:", error);
    //   }
    // }
    // fetchDashboard();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${ServerUrl}/api/admin/dashboard`);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setDashboard(parsedData);
    };

    eventSource.addEventListener('live', (event) => {
      const parsedData = JSON.parse(event.data);
      setDashboard(parsedData);
    });

    eventSource.addEventListener('heartbeat', () => {
      console.log("Baduum!")
    });

    eventSource.onerror = (error) => {
      console.error('Error in SSE connection:', error);
    };
  }, []);

  const columnsClient = [
    {
      title: <span style={{ fontSize: 18, fontWeight: 400 }}>Id</span>,
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span style={{ fontSize: 18, fontWeight: 400 }}>Name</span>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <span style={{ fontSize: 18, fontWeight: 400 }}>Gmail</span>,
      dataIndex: "gmail",
      key: "gmail",
    },
    {
      title: <span style={{ fontSize: 18, fontWeight: 400 }}>Phone</span>,
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: <span style={{ fontSize: 18, fontWeight: 400 }}>Status</span>,
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Badge bg={status === "active" ? "success" : "danger"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ),
    },
    {
      title: <span style={{ fontSize: 18, fontWeight: 400 }}>Action</span>,
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Button variant="link" style={{ padding: 0, margin: 0 }}>
            Edit
          </Button>
          <span style={{ margin: "0 8px" }}>|</span>
          <Button variant="link" style={{ padding: 0, margin: 0 }}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const dataClient = [
    {
      id: "CL_0001",
      name: "John Brown",
      phone: "01234556",
      gmail: "New York No. 1 Lake Park",
      status: "active",
    },
    {
      id: "CL_0002",
      name: "Jim Green",
      phone: "01234556",
      gmail: "London No. 1 Lake Park",
      status: "inactive",
    },
    {
      id: "CL_0003",
      name: "Joe Black",
      phone: "01234556",
      gmail: "Sydney No. 1 Lake Park",
      status: "active",
    },
    {
      id: "CL_0004",
      name: "John Brown",
      phone: "01234556",
      gmail: "New York No. 1 Lake Park",
      status: "active",
    },
    {
      id: "CL_0005",
      name: "Jim Green",
      phone: "01234556",
      gmail: "London No. 1 Lake Park",
      status: "inactive",
    },
    {
      id: "CL_0006",
      name: "Joe Black",
      phone: "01234556",
      gmail: "Sydney No. 1 Lake Park",
      status: "active",
    },
    {
      id: "CL_0007",
      name: "John Brown",
      phone: "01234556",
      gmail: "New York No. 1 Lake Park",
      status: "active",
    },
    {
      id: "CL_0008",
      name: "Jim Green",
      phone: "01234556",
      gmail: "London No. 1 Lake Park",
      status: "inactive",
    },
    {
      id: "CL_0009",
      name: "Joe Black",
      phone: "01234556",
      gmail: "Sydney No. 1 Lake Park",
      status: "active",
    },
  ];

  const columnsOrder = [
    {
      title: <span style={{ fontSize: 20, fontWeight: 400 }}>OrderID</span>,
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 400 }}>Name</span>,
      dataIndex: "customerID",
      key: "customerID",
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 400 }}>totalPrice</span>,
      key: "total",
      dataIndex: "total",
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 400 }}>Status</span>,
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Badge bg={status === "paid" ? "success" : "danger"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ),
    },
  ];


  const paginatedDataClient = dataClient.slice(
    (currentPageClients - 1) * itemsPerPage,
    currentPageClients * itemsPerPage
  );

  const paginatedDataOrder = order.slice(
    (currentPageOrders - 1) * itemsPerPage,
    currentPageOrders * itemsPerPage
  );

  return (
    <Container fluid style={{ padding: "3%" }}>
      <p style={{ margin: 0, fontSize: 24 }} className="fw-bolder">
        Welcome, {decodedToken.first_name}!
      </p>
      <p style={{ fontSize: 16 }}>Dashboard</p>
      <Row style={{ marginBottom: "1%" }}>
        <Col md={3}>
          <div
            style={{
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.15)",
              borderStyle: "solid",
              borderRadius: 5,
              padding: "12px 12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                borderRadius: 5,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(229, 229, 229, 1)",
              }}
            >
              <HiOutlineUserGroup size={24} color="rgba(163, 163, 163, 1)" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <p style={{ margin: 0, fontSize: 17, fontWeight: 400 }}>
                Client
              </p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
                {dashboard ? dashboard.numCustomers : "Loading..."}
              </p>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div
            style={{
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.15)",
              borderStyle: "solid",
              borderRadius: 5,
              padding: "12px 12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                borderRadius: 5,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(229, 229, 229, 1)",
              }}
            >
              <LiaUser size={24} color="rgba(163, 163, 163, 1)" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <p style={{ margin: 0, fontSize: 17, fontWeight: 400 }}>
                Employees
              </p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
                {dashboard ? dashboard.numStaffs : "Loading..."}
              </p>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div
            style={{
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.15)",
              borderStyle: "solid",
              borderRadius: 5,
              padding: "12px 12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                borderRadius: 5,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(229, 229, 229, 1)",
              }}
            >
              <IoMdCart size={24} color="rgba(163, 163, 163, 1)" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <p style={{ margin: 0, fontSize: 17, fontWeight: 400 }}>
                Orders
              </p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
                {dashboard ? dashboard.numOrders : "Loading..."}
              </p>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div
            style={{
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.15)",
              borderStyle: "solid",
              borderRadius: 5,
              padding: "12px 12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                borderRadius: 5,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(229, 229, 229, 1)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 24,
                  color: "rgba(163, 163, 163, 1)",
                }}
              >
                $
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <p style={{ margin: 0, fontSize: 17, fontWeight: 400 }}>
                Revenue
              </p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
                $ {dashboard ? dashboard.revenue : "Loading..."}
              </p>
            </div>
          </div>
        </Col>
      </Row>
      <Row style={{ marginBottom: "1%" }}>
        <Col md={6}>
          <div
            style={{
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.15)",
              borderStyle: "solid",
              borderRadius: 5,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "10px 10px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                margin: 0,
                fontSize: 24,
                fontWeight: 500,
              }}
            >
              Revenue per month
            </h1>
            <div style={{ flex: 1 }}>
              <LineChartComponent data={dashboard}/>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div
            style={{
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.15)",
              borderStyle: "solid",
              borderRadius: 5,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "10px 10px",
            }}
          >
            <p style={{ margin: 0, fontSize: 20 }} className="fw-bolder">
              Orders
            </p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {columnsOrder.map((col) => (
                    <th key={col.key}>{col.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedDataOrder.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    {/* <td>{row.budget}</td> */}
                    <td>{row.quotation.totalPrice}</td>
                    <td>
                      <Badge bg={row.status === "paid" ? "success" : "danger"}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <p style={{ margin: 0, fontSize: 20 }} className="fw-bolder">
        Clients
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columnsClient.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedDataClient.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.gmail}</td>
              <td>{row.phone}</td>
              <td>
                <Badge bg={row.status === "active" ? "success" : "danger"}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              </td>
              <td>
                <Button variant="link" style={{ padding: 0, margin: 0 }}>
                  Edit
                </Button>
                <span style={{ margin: "0 8px" }}>|</span>
                <Button variant="link" style={{ padding: 0, margin: 0 }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
