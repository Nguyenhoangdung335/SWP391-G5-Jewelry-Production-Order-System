import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaBox } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function GemstoneManager() {
  const { account } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedGemstone, setSelectedGemstone] = useState(null);
  const [deleteGemstone, setDeleteGemstone] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);

  console.log(data);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${ServerUrl}/api/admin/gemstones`,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setData(res.data.responseList);
      })
      .catch((err) => console.log(err));
  }, [currentPage]);

  const handleEdit = (record) => {
    setSelectedGemstone(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (record) => {
    setDeleteGemstone(record);
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedGemstone(null);
  };

  const handleConfirmDelete = () => {
    const GemstoneId = deleteGemstone.id;
    console.log(GemstoneId);
    axios({
      method: "DELETE",
      url: `${ServerUrl}/api/admin/gemstone-type/${GemstoneId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res);
        setIsDeleteModalVisible(false);
        setDeleteGemstone(null);

        // Remove the deleted Gemstone from data
        const updatedData = data.filter((product) => product.id !== GemstoneId);
        setData(updatedData);
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
      });
  };

  const handleAddCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      id: form.formProductId.value,
      name: form.formProductName.value,
      description: form.formProductDescription.value,
    };
    const newData = data.map((item) => (item.id === values.id ? values : item));
    setData(newData);
    setIsModalVisible(false);
    setSelectedGemstone(null);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newProduct = {
      id: form.formProductId.value,
      name: form.formProductName.value,
      description: form.formProductDescription.value,
    };

    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (!newProduct.id || !newProduct.name || !newProduct.description) {
      alert("Please fill in all fields");
      return;
    }

    // Gửi yêu cầu POST tới back-end
    axios({
      method: "POST",
      url: `${ServerUrl}/api/products`,
      headers: { "Content-Type": "application/json" },
      data: newProduct,
    })
      .then((res) => {
        // Thêm sản phẩm mới vào trạng thái data nếu thành công
        setData([...data, res.data]);
        setIsCreateModalVisible(false);
      })
      .catch((err) => {
        console.error("Error creating Gemstone:", err);
        alert("There was an error creating the product. Please try again.");
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteGemstone(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.gemstoneType.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <style jsx>{`
        .new-product-button {
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
        .new-product-button:hover {
          background-color: #007bff;
        }
      `}</style>
      <div className="mb-2">
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          Welcome, Admin!
        </p>
        <p style={{ fontSize: 18 }}>Gemstone Management</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "2%",
        }}
      >
        <div></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div onClick={() => setIsCreateModalVisible(true)}>
            <Button>
              <FiPlus />
              New Gemstone
            </Button>
          </div>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Shape</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((gemstone) => (
            <tr key={gemstone.id}>
              <td>{gemstone.id}</td>
              <td>{gemstone.name}</td>
              <td>{gemstone.basePricePerCarat}</td>
              <td>{gemstone.status ? "True" : "False"}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleEdit(gemstone)}
                  >
                    <FaEdit size={20} />
                  </Button>
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleDeleteClick(gemstone)}
                  >
                    <FaTrash size={20} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
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

      {/* Edit Gemstone */}
      <Modal show={isModalVisible} onHide={handleCancel} centered>
        <Modal.Header>
          <Modal.Title>Edit Gemstone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGemstone && (
            <Form onSubmit={handleSave}>
              <Form.Group controlId="formProductId">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedGemstone.id}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formProductName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedGemstone.name}
                />
              </Form.Group>
              <Form.Group controlId="formProductDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedGemstone.description}
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="mt-2"
                >
                  Back
                </Button>
                <Button variant="primary" type="submit" className="mt-2">
                  Save changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Gemstone */}
      <Modal show={isDeleteModalVisible} onHide={handleCancelDelete} centered>
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this Gemstone?</p>
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

      {/* Create Gemstone */}
      <Modal show={isCreateModalVisible} onHide={handleAddCancel} centered>
        <Modal.Header>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <FaBox /> <span className="text-4xl ml-3 font-medium">Product</span>
          </div>
          <Form onSubmit={handleAdd}>
            <Form.Group controlId="formProductId">
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="formProductName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="formProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={handleAddCancel}>
                Back
              </Button>
              <Button type="submit">Save changes</Button>

              {/* <Button
                variant="secondary"
                onClick={handleAddCancel}
                style={{ marginLeft: 8 }}
              >
                Create Your Dream Jewelry
              </Button> */}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
