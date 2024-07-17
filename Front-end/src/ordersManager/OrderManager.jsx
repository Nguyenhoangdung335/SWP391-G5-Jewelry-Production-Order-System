import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { OrderStatus } from "../data/OrderStatus";
import ServerUrl from "../reusable/ServerUrl";
import { useNavigate } from "react-router-dom";

export default function OrderManager() {
  const { token } = useAuth();
  let decodedToken;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("ALL"); // Optional status filter
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = decodedToken?.role;
    const accountId = decodedToken?.id;

    const fetchOrders = (pageNumber) => {
      axios({
        method: "GET",
        url: `${ServerUrl}/api/order/list${pageNumber - 1}`,
        headers: { "Content-Type": "application/json" },
        params: {
          role: userRole,
          status: filteredStatus,
          accountId: accountId,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setData(res.data.responseList.orders);
            setTotalPages(res.data.responseList.totalPages);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchOrders(currentPage);
  }, [currentPage, filteredStatus]);

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setFilteredStatus(selectedValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Budget", dataIndex: "budget" },
    { title: "Created Date", dataIndex: "createdDate" },
    { title: "Completed Date", dataIndex: "completedDate" },
    { title: "Status", dataIndex: "status" },
    { title: "Detail", dataIndex: "detail" },
  ];

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const showDetail = (order) => {
    navigate("/userManager/orders_manager/order_detail", { state: order.id });
  };

  const handleClose = () => setIsModalVisible(false);

  const styles = {
    paginationContainer: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: "20px",
    },
    paginationButton: {
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 5px",
      border: "1px solid #ddd",
      backgroundColor: "#f8f9fa",
      cursor: "pointer",
    },
    paginationButtonActive: {
      backgroundColor: "#6c757d",
      color: "#fff",
    },
    paginationButtonDisabled: {
      backgroundColor: "#e9ecef",
      color: "#6c757d",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={{ padding: "3%" }}>
      <p style={{ margin: 0, fontSize: 24 }} className="fw-bolder">
        Welcome, K!
      </p>
      <p style={{ fontSize: 16 }}>Order</p>

      <div className="rounded-lg bg-neutral-500 text-white pl-3 flex items-center">
          <div>Role Filter</div>
          <div  className="w-25"> 
          <select className="bg-neutral-500 form-select inline-block text-orange-500 w-44" onChange={handleFilterChange}>
            {OrderStatus.map((status) => (
              <option key={status.name} value={status.value} className="bg-white text-black">
                {status.name}
              </option>
            ))}
          </select>
          </div>
          <div className="relative right-6 pb-2">
            <Icon icon="fa:sort-down" />
          </div>
        </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.dataIndex}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.budget}</td>
              <td>{order.createdDate}</td>
              <td>{order.completedDate}</td>
              <td>
                <span
                  className={`badge ${
                    order.status === "completed" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td>
                <Button variant="primary" onClick={() => showDetail(order)}>
                  Show Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={styles.paginationContainer}>
        <div
          style={{ ...styles.paginationButton, ...(currentPage === 1 ? styles.paginationButtonDisabled : {}) }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </div>
        {[...Array(totalPages).keys()].map((page) => (
          <div
            key={page + 1}
            style={{
              ...styles.paginationButton,
              ...(page + 1 === currentPage ? styles.paginationButtonActive : {})
            }}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </div>
        ))}
        <div
          style={{ ...styles.paginationButton, ...(currentPage === totalPages ? styles.paginationButtonDisabled : {}) }}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </div>
      </div>

      <Modal show={isModalVisible} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Name:</strong> {selectedOrder.name}</p>
              <p><strong>Budget:</strong> {selectedOrder.budget}</p>
              <p><strong>Created Date:</strong> {selectedOrder.createdDate}</p>
              <p><strong>Completed Date:</strong> {selectedOrder.completedDate}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Details:</strong> Details of the order go here...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
