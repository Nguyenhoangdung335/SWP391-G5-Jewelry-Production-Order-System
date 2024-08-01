import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaBox } from "react-icons/fa";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import ConfirmationModal from "../reusable/ConfirmationModal";
import MetalEditor from "./MetalEditor";
import { useAlert } from "../provider/AlertProvider";

export default function MetalManager() {
  const {showAlert} = useAlert();
  const {token} = useAuth();

  const [showMetalEditor, setShowMetalEditor] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [selectedMetal, setSelectedMetal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("id");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;
  const [data, setData] = useState([]);
  const decodedToken = jwtDecode(token);

  const fetchMetalPage = useCallback( async () => {
    const response = await axios.get(`${ServerUrl}/api/metal`, {
      params: {size: itemsPerPage, page: currentPage - 1, sortBy: filter},
      headers: {"Content-Type": "application/json"},
    } );

    if (response.status === 200) {
      const fetchData = response.data.responseList;
      setData(fetchData.metals);
      setTotalPages(fetchData.totalPages);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(currentPage - 1);
    fetchMetalPage();
  }, [fetchMetalPage, currentPage, totalPages]);

  const handleEdit = (metal) => {
    setSelectedMetal(metal);
    setShowMetalEditor(true);
  };

  const handleHideEditor = () => {
    setSelectedMetal(null);
    setShowMetalEditor(false);
  }

  /*----------------------------------------*/
  /*--------METAL DELETION ACTIONS----------*/
  /*----------------------------------------*/
  const handleConfirm = (metal) => {
    setShowConfirmDelete(true);
    setSelectedMetal(metal)
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${ServerUrl}/api/metal/${selectedMetal.id}`);
      if (response.status === 200) {
        showAlert("Success", response.data.message, "success");
        fetchMetalPage();
      } else {
        showAlert("Failed", response.data.message || response.data.detail, "danger");
      }
    } catch (error) {
      showAlert("Failed", "Delete request failed", "danger");
    } finally {
      setSelectedMetal(null);
      setShowConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedMetal(null);
    setShowConfirmDelete(false);
  };
  /*----------------------------------------*/

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pagination = [];
    const displayPages = 3; // Number of pages to display before and after current page
    const firstPage = Math.max(2, currentPage - displayPages);
    const lastPage = Math.min(totalPages - 1, currentPage + displayPages);

    pagination.push(
        <div
            key={1}
            style={{
              ...styles.paginationButton,
              ...(currentPage === 1 ? styles.paginationButtonActive : {}),
            }}
            onClick={() => handlePageChange(1)}
        >
          1
        </div>
    );

    if (firstPage > 2) {
      pagination.push(<div key="start-ellipsis">...</div>);
    }

    for (let i = firstPage; i <= lastPage; i++) {
      pagination.push(
          <div
              key={i}
              style={{
                ...styles.paginationButton,
                ...(i === currentPage ? styles.paginationButtonActive : {}),
              }}
              onClick={() => handlePageChange(i)}
          >
            {i}
          </div>
      );
    }

    if (lastPage < totalPages - 1) {
      pagination.push(<div key="end-ellipsis">...</div>);
    }

    pagination.push(
        <div
            key={totalPages}
            style={{
              ...styles.paginationButton,
              ...(currentPage === totalPages ? styles.paginationButtonActive : {}),
            }}
            onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </div>
    );

    return pagination;
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
          Welcome, {decodedToken.first_name}!
        </p>
        <p style={{ fontSize: 18 }}>Metal Management</p>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="sm"
          style={{width: "auto", cursor: "pointer"}}
        >
          <option value="id">Default</option>
          <option value="name">Name</option>
          <option value="marketPrice">Market Price</option>
          <option value="companyPrice">Companny Price</option>
          <option value="updatedTime">Updated Time</option>
        </Form.Select>

        <Button onClick={() => setShowMetalEditor(true)}>
          <FiPlus /> New Gemstone
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>unit</th>
            <th>Market Price</th>
            <th>Company Price</th>
            <th>Updated time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((metal) => (
            <tr key={metal.id}>
              <td>{metal.id}</td>
              <td>{metal.name}</td>
              <td>{metal.unit}</td>
              <td>{formatPrice(metal.marketPrice)}</td>
              <td>{formatPrice(metal.companyPrice)}</td>
              <td>{metal.updatedTime}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleEdit(metal)}
                  >
                    <FaEdit size={20} />
                  </Button>
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleConfirm(metal)}
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
        {renderPagination()}
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

      <MetalEditor isShow={showMetalEditor} onHide={handleHideEditor} metalData={selectedMetal} fetchData={fetchMetalPage}/>

      {selectedMetal && (
        <ConfirmationModal
          title="Confirmation"
          body={"Are you sure you want to delete the metal ID " + selectedMetal?.id}
          show={showConfirmDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

    </div>
  );
}

const formatPrice = (price) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};