import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import {useAlert} from "../provider/AlertProvider";

export default function EmployeeManager() {
  const [filterRole, setFilterRole] = useState("ALL");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);
  const {showAlert} = useAlert()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/account/${currentPage - 1}`,
          {
            headers: { "Content-Type": "application/json" },
            params: {
              role: filterRole,
              size: itemsPerPage,
            },
          }
        );
        console.log("API response:", res.data);
        setData(res.data.responseList.accounts);
        setTotalPages(res.data.responseList.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [filterRole, currentPage, deleteUser]);

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

  const formatDate = (dateArray) => {
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      id: selectedUser.id,
      role: form.role.value,
      email: form.gmail.value,
      phone: form.phone.value,
      dateCreated: selectedUser.dateCreated,
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

    try {
      const res = await axios.put(`${ServerUrl}/api/account/`, values, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Update Response:", res.data);
      const updatedData = data.map((item) =>
        item.id === values.id ? values : item
      );
      setData(updatedData);
        showAlert(
            "Edited successfully",
            "Edited " + values.id + " successfully",
            "success"
        );
      setIsModalVisible(false);
      setSelectedUser(null);
    } catch (err) {
        showAlert(
            "Edit  failed",
            "Edit " + values.id + " failed",
            "danger"
        );
      console.error("Error updating account:", err);
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newEmployee = {
      role: form.role.value,
      email: form.gmail.value,
      password: form.password.value,
      phone: form.phone.value,
      status: "ACTIVE",
      userInfo: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        birthDate: form.birthDate.value,
        gender: form.gender.value,
        phoneNumber: form.phone.value,
        address: form.address.value,
      },
    };

    try {
      const res = await axios.post(`${ServerUrl}/api/account/`, newEmployee, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Add Response:", res.data.responseList.account);
      setData([...data, res.data.responseList.account]); // Update state with new data
        showAlert(
          "Added successfully",
          "Added " + res.data.responseList.account.id + " successfully",
          "success"
        );
      setIsAddModalVisible(false);

    } catch (err) {
        showAlert(
            "Add failed",
            "",
            "danger"
        );
      console.error("Error adding account:", err);
    }
  };

  const handleAddClick = () => {
    setIsAddModalVisible(true);
  };

  const handleDeleteClick = (id) => {
    if (id === decodedToken.id) {
      showAlert(
          "Delete Failed",
          "You cannot delete your own account",
          "warning"
      );
    } else {
      // Otherwise, proceed with the deletion
      setDeleteUser(id);
      setDeleteModalVisible(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(`${ServerUrl}/api/account/${deleteUser}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Delete Response:", res.data);
      const updatedData = data.filter((item) => item.id !== deleteUser);
      setData(updatedData);
        showAlert(
            "Deleted successfully",
            "Deleted " + deleteUser + " successfully",
            "success"
        );
    } catch (err) {
        showAlert(
            "Delete failed",
            "",
            "danger"
        );
      console.log("Error deleting account:", err);
    }
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

  const filteredData =
    filterRole !== "ALL"
      ? data.filter(
          (item) => item.role.toLowerCase() === filterRole.toLowerCase()
        )
      : data;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      <div className="mb-2">
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          Welcome, {decodedToken.first_name}!
        </p>
        <p style={{ fontSize: 18 }}>Staffs Management</p>
      </div>

      <div
        className="mb-4"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="rounded-lg bg-neutral-500 text-white pl-3 flex items-center align-content-center">
          {/* <div>Role Filter</div> */}
          <select
            className="bg-neutral-500 form-select inline-block text-orange-500 w-44"
            onChange={handleFilterChange}
          >
            <option value="ALL" className="bg-white text-black">
              ALL
            </option>
            {/* <option value="CUSTOMER" className="bg-white text-black">
              Customer
            </option> */}
            <option value="ADMIN" className="bg-white text-black">
              Admin
            </option>
            <option value="SALE_STAFF" className="bg-white text-black">
              Sale Staff
            </option>
            <option value="DESIGN_STAFF" className="bg-white text-black">
              Design Staff
            </option>
            <option value="PRODUCTION_STAFF" className="bg-white text-black">
              Production Staff
            </option>
            <option value="MANAGER" className="bg-white text-black">
              Manager
            </option>
          </select>
          {/* <div className="relative right-6 pb-2">
            <Icon icon="fa:sort-down" />
          </div> */}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button onClick={handleAddClick}>
            <FiPlus />
            Add Staff
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Role</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                <div className="p-3">
                  <h5 className="font-weight-bold text-muted">No users with corresponding role available</h5>
                </div>
              </td>
            </tr>
        ) : (
            data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>{`${item.userInfo.firstName} ${item.userInfo.lastName}`}</td>
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
                  <td className="d-flex justify-content-center gap-2">
                    <Button
                        className="border-0"
                        variant="link"
                        onClick={() => handleEdit(item)}
                    >
                      <FaEdit size={20}/>
                    </Button>
                    <Button
                        className="border-0"
                        variant="link"
                        onClick={() => handleDeleteClick(item.id)}
                    >
                      <FaTrash size={20}/>
                    </Button>
                  </td>
                </tr>
            ))
        )}
        </tbody>

      </Table>

      <div style={styles.paginationContainer}>
        <div
            style={{
              ...styles.paginationButton,
              ...(currentPage === 1 ? styles.paginationButtonDisabled : {}),
            }}
            onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </div>
        {[...Array(totalPages).keys()].map((page) => (
            <div
                key={page + 1}
                style={{
                  ...styles.paginationButton,
                  ...(page + 1 === currentPage
                      ? styles.paginationButtonActive
                      : {}),
                }}
                onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </div>
        ))}
        <div
            style={{
              ...styles.paginationButton,
              ...(currentPage === totalPages
                  ? styles.paginationButtonDisabled
                  : {}),
            }}
            onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </div>
      </div>

      <Modal show={isModalVisible} onHide={handleCancel}>
        <Modal.Header>
          <Modal.Title>Edit Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedUser && (
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <FormControl
                  type="text"
                  defaultValue={selectedUser.id}
                  disabled
                  name="id"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <FormControl
                  type="email"
                  defaultValue={selectedUser.email}
                  name="gmail"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <FormControl
                  as="select"
                  defaultValue={selectedUser.role}
                  name="role"
                >
                  {/* <option value="CUSTOMER">Customer</option> */}
                  <option value="ADMIN">Admin</option>
                  <option value="SALE_STAFF">Sale Staff</option>
                  <option value="DESIGN_STAFF">Design Staff</option>
                  <option value="PRODUCTION_STAFF">Production Staff</option>
                  <option value="MANAGER">Manager</option>
                </FormControl>
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <FormControl
                      type="text"
                      defaultValue={selectedUser.userInfo.firstName}
                      name="firstName"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <FormControl
                      type="text"
                      defaultValue={selectedUser.userInfo.lastName}
                      name="lastName"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <FormControl
                  type="text"
                  defaultValue={selectedUser.userInfo.phoneNumber}
                  name="phone"
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Birth Date</Form.Label>
                    <FormControl
                      type="date"
                      defaultValue={formatDate(selectedUser.userInfo.birthDate)}
                      name="birthDate"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <FormControl
                      as="select"
                      defaultValue={selectedUser.userInfo.gender}
                      name="gender"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </FormControl>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <FormControl
                  type="text"
                  defaultValue={selectedUser.userInfo.address}
                  name="address"
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center ">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  style={{ marginLeft: 8, marginTop: 20 }}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginTop: 20 }}
                >
                  Save changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal centered show={deleteModalVisible} onHide={handleCancelDelete}>
        <Modal.Header>
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

      <Modal
        show={isAddModalVisible}
        onHide={() => setIsAddModalVisible(false)}
      >
        <Modal.Header>
          <Modal.Title>Add Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group controlId="formRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <FormControl as="select" name="role" required>
                {/* <option value="CUSTOMER">Customer</option> */}
                <option value="ADMIN">Admin</option>
                <option value="SALE_STAFF">Sale Staff</option>
                <option value="DESIGN_STAFF">Design Staff</option>
                <option value="PRODUCTION_STAFF">Production Staff</option>
                <option value="MANAGER">Manager</option>
              </FormControl>
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <FormControl type="text" name="firstName" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <FormControl type="text" name="lastName" required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formGmail" className="mb-3">
              <Form.Label>Gmail</Form.Label>
              <FormControl type="email" name="gmail" required />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <FormControl type="password" name="password" required />
            </Form.Group>
            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Phone</Form.Label>
              <FormControl type="text" name="phone" required />
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formBirthDate">
                  <Form.Label>Birth Date</Form.Label>
                  <FormControl type="date" name="birthDate" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <FormControl as="select" name="gender" required>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </FormControl>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <FormControl type="text" name="address" required />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => setIsAddModalVisible(false)}
                className="mt-2"
              >
                Back
              </Button>
              <Button variant="primary" type="submit" className="mt-2">
                Add Employee
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
