import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { roles } from "../data/Roles";
import { Icon } from "@iconify/react";
import ServerUrl from "../reusable/ServerUrl";

export default function ClientManager() {
  const [filterRole, setFilterRole] = useState("CUSTOMER");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/admin/get/account/${currentPage - 1}?role=${filterRole}`, {
          headers: { "Content-Type": "application/json" },
        });
        setData(res.data.responseList.accounts);
        setTotalPages(res.data.responseList.totalPages);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [filterRole, currentPage]);

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setFilterRole(selectedValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      id: selectedUser.id,
      role: form.role.value,
      email: form.gmail.value,
      phone: form.phone.value,
      status: selectedUser.status,
      userInfo: {
        id: selectedUser.userInfo.id,
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        birthDate: form.birthDate.value,
        gender: form.gender.value,
        phoneNumber: form.phone.value,
        address: form.address.value,
      },
    };
  
    const newData = data.map((item) => (item.id === values.id ? values : item));
    setData(newData); // Update state immutably
    setIsModalVisible(false);
    setSelectedUser(null);
  };
  
  const handleAdd = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newEmployee = {
      id: `ID_${data.length + 1}`,
      role: form.role.value,
      email: form.gmail.value,
      phone: form.phone.value,
      status: "active",
      userInfo: {
        id: `ID_${data.length + 1}`,
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        birthDate: form.birthDate.value,
        gender: form.gender.value,
        phoneNumber: form.phone.value,
        address: form.address.value,
      },
    };
    setData([...data, newEmployee]); // Update state immutably
    setIsAddModalVisible(false);
  };
  

  const handleAddClick = () => {
    setIsAddModalVisible(true);
  };

  const handleDeleteClick = (record) => {
    setDeleteUser(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    const newData = data.filter((item) => item.id !== deleteUser.id);
    setData(newData);
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
      <p style={{ fontSize: 16 }}>Client Manager</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "2%",
        }}
      >
        <div className="rounded-lg bg-neutral-500 text-white pl-3 flex items-center">
          <div>Role Filter</div>
          <select className="bg-neutral-500 inline-block text-orange-500 w-44" onChange={handleFilterChange}>
            {roles.map((role) => (
              <option key={role.name} value={role.value} className="bg-white text-black">
                {role.name}
              </option>
            ))}
          </select>
          <div className="relative right-6 pb-2">
            <Icon icon="fa:sort-down" />
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
            onClick={handleAddClick}
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
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.role}</td>
              <td>
                {item.userInfo.firstName} {item.userInfo.lastName}
              </td>
              <td>{item.email}</td>
              <td>{item.userInfo.phoneNumber}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "ACTIVE" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <Button variant="link" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
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
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            ...styles.paginationButton,
            ...(currentPage === 1 && styles.paginationButtonDisabled),
          }}
          disabled={currentPage === 1}
        >
          &lt;
        </div>
        {[...Array(totalPages)].map((_, index) => (
          <div
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              ...styles.paginationButton,
              ...(currentPage === index + 1 && styles.paginationButtonActive),
            }}
          >
            {index + 1}
          </div>
        ))}
        <div
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            ...styles.paginationButton,
            ...(currentPage === totalPages && styles.paginationButtonDisabled),
          }}
          disabled={currentPage === totalPages}
        >
          &gt;
        </div>
      </div>

      <Modal show={isModalVisible} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleSave}>
              <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={selectedUser.role}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={selectedUser.userInfo.firstName}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={selectedUser.userInfo.lastName}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="gmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  defaultValue={selectedUser.email}
                  required
                />
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedUser.userInfo.phoneNumber}
                  required
                />
              </Form.Group>

              <Form.Group controlId="birthDate">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={selectedUser.userInfo.birthDate}
                  required
                />
              </Form.Group>

              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={selectedUser.userInfo.gender}
                  required
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedUser.userInfo.address}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={isAddModalVisible} onHide={() => setIsAddModalVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" required>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="gmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>

            <Form.Group controlId="birthDate">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>

            <Form.Group controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control as="select" required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Add Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={deleteModalVisible} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this employee?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              className="ms-2"
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}