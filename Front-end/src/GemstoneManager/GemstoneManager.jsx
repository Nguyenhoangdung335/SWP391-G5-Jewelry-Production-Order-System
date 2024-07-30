import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, ModalBody } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaBox } from "react-icons/fa";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { GemstoneForm } from "./GemstoneForm";

export default function GemstoneManager() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedGemstone, setSelectedGemstone] = useState(null);
  const [deleteGemstone, setDeleteGemstone] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const itemsPerPage = 20;
  const [data, setData] = useState([]);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${ServerUrl}/api/gemstone?page=${
        currentPage - 1
      }&size=${itemsPerPage}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setData(res.data.responseList.gemstone);
        setTotalPage(res.data.responseList.totalPages);
        if (reRender === true) {
          setReRender(false);
        }
      })
      .catch((err) => {
        console.error(err);
        console.log(err);
      });
  }, [currentPage, reRender]);

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
      url: `${ServerUrl}/api/gemstone/${GemstoneId}`,
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

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteGemstone(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    // (currentPage - 1) * itemsPerPage,
    // currentPage * itemsPerPage
    0,
    20
  );

  const totalPages = totalPage;

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

  const handleReRender = (data) => {
    setReRender(data);
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
      <div style={{ maxHeight: "320px", overflowY: "auto" }}>
        <Table striped bordered hover>
          <thead style={{ position: "sticky", top: "-1%" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Shape</th>
              <th>Cut</th>
              <th>Clarity</th>
              <th>Color</th>
              <th>Carat Weight From - To</th>
              <th>Price Per Carat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((gemstone) => (
              <tr key={gemstone.id}>
                <td>{gemstone.id}</td>
                <td>{gemstone.name}</td>
                <td>{gemstone.shape}</td>
                <td>{gemstone.cut}</td>
                <td>{gemstone.clarity}</td>
                <td>{gemstone.color}</td>
                <td>
                  {gemstone.caratWeightFrom} - {gemstone.caratWeightTo}
                </td>
                <td>{formatPrice(gemstone.pricePerCaratInHundred * 100)}</td>
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
      </div>

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
      <Modal show={isModalVisible} onHide={handleCancel} centered size="lg">
        <Modal.Header>
          <Modal.Title>Edit Gemstone</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: "100%" }}>
          <GemstoneForm
            types="editGemstone"
            onClose={handleAddCancel}
            selectedGemstone={selectedGemstone}
            isUpdated={handleReRender}
          />
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
      <Modal
        show={isCreateModalVisible}
        onHide={handleAddCancel}
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Add Gemstone</Modal.Title>
        </Modal.Header>
        <ModalBody style={{ width: "100%" }}>
          <GemstoneForm
            types="addGemstone"
            onClose={handleAddCancel}
            isUpdated={handleReRender}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

const formatPrice = (price) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
