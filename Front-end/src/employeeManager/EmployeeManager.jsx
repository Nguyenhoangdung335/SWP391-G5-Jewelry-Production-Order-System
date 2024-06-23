import React, { useState } from "react";
import { Table, Button, Modal, Form, FormControl } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa";

export default function EmployeeManager() {
  const [filterRole, setFilterRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setFilterRole(selectedValue);
  };

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleSave = (values) => {
    console.log("Saved values:", values);
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (record) => {
    setDeleteUser(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting user:", deleteUser);
    // Implement the deletion logic here
    setDeleteModalVisible(false);
    setDeleteUser(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteUser(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const data = [
    { id: "AD_0001", role: "Admin", name: "Tran Mai Quang Khai", gmail: "khaitmq@gmail.com", phone: "0867406725", status: "active" },
    { id: "MA_0002", role: "Manager", name: "Nguyen Hoang Dung", gmail: "dungnh@gmail.com", phone: "0574179547", status: "inactive" },
    { id: "SS_0003", role: "Sales Staff", name: "Vu Tien Dat", gmail: "datvt@gmail.com", phone: "0936127853", status: "active" },
    { id: "AD_0004", role: "Admin", name: "Nguyen Viet Thai", gmail: "thainv@gmail.com", phone: "0826709871", status: "active" },
    { id: "AD_0005", role: "Admin", name: "Bui Khanh Duy", gmail: "duybkse73484@gmail.com", phone: "0936137090", status: "active" },
    { id: "AD_0006", role: "Admin", name: "Ly Hoang Khang", gmail: "khang@gmail.com", phone: "0845123898", status: "active" },
    { id: "AD_0007", role: "Admin", name: "Ha Duy Tung", gmail: "tung@gmail.com", phone: "091834926", status: "inactive" },
    { id: "AD_0008", role: "Admin", name: "Doan Dang Thien Bao", gmail: "bao@gmail.com", phone: "0938110083", status: "active" },
    { id: "AD_0009", role: "Admin", name: "Nguyen Huu Quoc Hung", gmail: "hung@gmail.com", phone: "0965326132", status: "inactive" },
    { id: "CB_0010", role: "Contribution", name: "Duong Hong An", gmail: "An@gmail.com", phone: "0987665512", status: "active" },
  ];

  const filteredData = filterRole
    ? data.filter((item) => item.role.toLowerCase() === filterRole.toLowerCase())
    : data;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      <style jsx>{`
        .add-employee-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          background-color: #6c757d;
          border: none;
          color: #e0d7ea;
          padding: 8px 16px;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .add-employee-button:hover {
          background-color: #007bff;
        }
        .role-filter-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 10px;
          background-color: rgba(101, 101, 101, 1);
          color: white;
          font-size: 20px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background-color 0.3s;
        }
        .role-filter-button:hover {
          background-color: #007bff;
        }
        .role-filter-select {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .role-filter-caret {
          margin-left: auto;
        }
      `}</style>
      <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>Welcome, K!</p>
      <p style={{ fontSize: 16 }}>Employee Manager</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "2%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div className="role-filter-button">
            <span>Role Filter</span>
            <span style={{ color: "rgba(255, 139, 55, 1)" }}>
              {filterRole || "All"}
            </span>
            <FaCaretDown className="role-filter-caret" />
            <FormControl
              as="select"
              value={filterRole}
              onChange={handleFilterChange}
              className="role-filter-select"
            >
              <option value="">All</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales Staff">Sales Staff</option>
              <option value="Contribution">Contribution</option>
            </FormControl>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Button
            variant="secondary"
            className="add-employee-button"
          >
            <FiPlus color="rgba(224, 215, 234, 1)" />
            Add Employee
          </Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role</th>
            <th>Name</th>
            <th>Gmail</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.role}</td>
              <td>{item.name}</td>
              <td>{item.gmail}</td>
              <td>{item.phone}</td>
              <td>
                <span className={`badge ${item.status === "active" ? "bg-success" : "bg-danger"}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </td>
              <td>
                <Button variant="link" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <span style={{ margin: "0 5px" }}>|</span>
                <Button variant="link" onClick={() => handleDeleteClick(item)}>
                  Delete
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

      <Modal show={isModalVisible} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleSave}>
              <Form.Group>
                <Form.Label>ID</Form.Label>
                <FormControl
                  type="text"
                  defaultValue={selectedUser.id}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <FormControl type="text" defaultValue={selectedUser.role} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <FormControl type="text" defaultValue={selectedUser.name} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Gmail</Form.Label>
                <FormControl type="email" defaultValue={selectedUser.gmail} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <FormControl type="text" defaultValue={selectedUser.phone} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save changes
              </Button>
              <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: 8 }}>
                Back
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={deleteModalVisible} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this employee?</p>
        </Modal.Body>
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
