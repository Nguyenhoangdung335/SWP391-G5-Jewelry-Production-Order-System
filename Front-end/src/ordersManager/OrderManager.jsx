import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function OrderManager() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:8080/api/order/list",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setData(res.data.responseList['order-list']);
      })
      .catch((err) => console.log(err));
  }, []);

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
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleClose = () => setIsModalVisible(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);

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

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.dataIndex}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((order) => (
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
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
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
          disabled={currentPage === 1}
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
          disabled={currentPage === totalPages}
        >
          &gt;
        </div>
      </div>

      <Modal show={isModalVisible} onHide={handleClose}>
        <Modal.Header closeButton>
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
