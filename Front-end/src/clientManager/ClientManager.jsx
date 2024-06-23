import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";

export default function ClientManager() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([
    { id: "CL_0001", name: "Tran Mai Quang Khai", gmail: "khaitmq@gmail.com", phone: "0867406725", status: "active" },
    { id: "CL_0002", name: "Nguyen Hoang Dung", gmail: "dungnh@gmail.com", phone: "0574179547", status: "inactive" },
    { id: "CL_0003", name: "Vu Tien Dat", gmail: "datvt@gmail.com", phone: "0936127853", status: "active" },
    { id: "CL_0004", name: "Nguyen Viet Thai", gmail: "thainv@gmail.com", phone: "0826709871", status: "active" },
    { id: "CL_0005", name: "Bui Khanh Duy", gmail: "duybkse73484@gmail.com", phone: "0936137090", status: "active" },
    { id: "CL_0006", name: "Ly Hoang Khang", gmail: "khang@gmail.com", phone: "0845123898", status: "active" },
    { id: "CL_0007", name: "Ha Duy Tung", gmail: "tung@gmail.com", phone: "091834926", status: "inactive" },
    { id: "CL_0008", name: "Doan Dang Thien Bao", gmail: "bao@gmail.com", phone: "0938110083", status: "active" },
    { id: "CL_0009", name: "Nguyen Huu Quoc Hung", gmail: "hung@gmail.com", phone: "0965326132", status: "inactive" },
    { id: "CL_0010", name: "Duong Hong An", gmail: "An@gmail.com", phone: "0987665512", status: "active" },
  ]);

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (record) => {
    setDeleteUser(record);
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      id: form.id.value,
      name: form.name.value,
      gmail: form.gmail.value,
      phone: form.phone.value,
    };
    const newData = data.map((item) => (item.id === values.id ? values : item));
    setData(newData);
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newUser = {
      id: `CL_${data.length + 1}`,
      name: form.name.value,
      gmail: form.gmail.value,
      phone: form.phone.value,
      status: "active",
    };
    setData([...data, newUser]);
    setIsCreateModalVisible(false);
  };

  const handleConfirmDelete = () => {
    const newData = data.filter((item) => item.id !== deleteUser.id);
    setData(newData);
    setIsDeleteModalVisible(false);
    setDeleteUser(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteUser(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const columns = [
    { title: "ID", field: "id" },
    { title: "Name", field: "name" },
    { title: "Gmail", field: "gmail" },
    { title: "Phone", field: "phone" },
    { title: "Status", field: "status" },
    { title: "Action", field: "action" },
  ];

  const styles = {
    newUserButton: {
      backgroundColor: "#5a6268",
      color: "#fff",
      border: "none",
      display: "flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      borderRadius: "5px",
      marginRight: "1.5rem", // Adjust this value to move the button left or right
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    newUserButtonHover: {
      backgroundColor: "#007bff",
    },
    newUserButtonIcon: {
      marginRight: "0.5rem",
    },
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
    <div className="container py-4">
      <h1>Welcome, K!</h1>
      <p className="lead">Clients Manager</p>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div></div> {/* Placeholder to push the button to the right */}
        <Button
          style={styles.newUserButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.newUserButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.newUserButton.backgroundColor)}
          onClick={() => setIsCreateModalVisible(true)}
        >
          <FiPlus style={styles.newUserButtonIcon} />
          New User
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.gmail}</td>
              <td>{row.phone}</td>
              <td>
                <span className={`badge ${row.status === "active" ? "bg-success" : "bg-danger"}`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              </td>
              <td>
                <Button variant="link" onClick={() => handleEdit(row)}>Edit</Button>
                <Button variant="link" onClick={() => handleDeleteClick(row)}>Delete</Button>
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

      <Modal show={isModalVisible} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleSave}>
              <Form.Group controlId="id">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" defaultValue={selectedUser.id} disabled />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" defaultValue={selectedUser.name} />
              </Form.Group>
              <Form.Group controlId="gmail">
                <Form.Label>Gmail</Form.Label>
                <Form.Control type="email" defaultValue={selectedUser.gmail} />
              </Form.Group>
              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" defaultValue={selectedUser.phone} />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Save changes
              </Button>
              <Button variant="secondary" onClick={handleCancel} className="mt-3 ms-2">
                Back
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={isCreateModalVisible} onHide={() => setIsCreateModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group controlId="gmail">
              <Form.Label>Gmail</Form.Label>
              <Form.Control type="email" required />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add User
            </Button>
            <Button variant="secondary" onClick={() => setIsCreateModalVisible(false)} className="mt-3 ms-2">
              Back
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={isDeleteModalVisible} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
