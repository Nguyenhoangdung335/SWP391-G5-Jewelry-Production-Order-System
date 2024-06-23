import React, { useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";

export default function OrderManager() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const columns = [
    { title: "OrderID", dataIndex: "orderId" },
    { title: "CustomerID", dataIndex: "customerID" },
    { title: "Date", dataIndex: "date" },
    { title: "Total", dataIndex: "total" },
    { title: "Status", dataIndex: "status" },
    { title: "Detail", dataIndex: "detail" },
  ];

  const data = [
    {
      orderId: "ID_0001",
      customerID: "CL_0009",
      date: "11/6/1994",
      total: "$1200",
      status: "paid",
      detail: "",
    },
    {
      orderId: "ID_0002",
      customerID: "CL_0001",
      date: "11/6/1994",
      total: "$11000",
      status: "unpaid",
      detail: "",
    },
    {
      orderId: "ID_0003",
      customerID: "CL_0006",
      date: "11/6/1994",
      total: "$1200",
      status: "paid",
      detail: "",
    },
    {
      orderId: "ID_0004",
      customerID: "CL_0001",
      date: "11/6/1994",
      total: "$11000",
      status: "unpaid",
      detail: "",
    },
    {
      orderId: "ID_0005",
      customerID: "CL_0002",
      date: "11/6/1994",
      total: "$11000",
      status: "unpaid",
      detail: "",
    },
    {
      orderId: "ID_0006",
      customerID: "CL_0007",
      date: "11/6/1994",
      total: "$11000",
      status: "paid",
      detail: "",
    },
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
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.customerID}</td>
              <td>{order.date}</td>
              <td>{order.total}</td>
              <td>
                <span
                  className={`badge ${
                    order.status === "paid" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {order.status === "paid" ? "Paid" : "Unpaid"}
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
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Customer ID:</strong> {selectedOrder.customerID}</p>
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Total:</strong> {selectedOrder.total}</p>
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
