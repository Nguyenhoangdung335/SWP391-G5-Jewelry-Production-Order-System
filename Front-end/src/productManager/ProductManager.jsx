import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useAlert } from "../provider/AlertProvider";
import { jwtDecode } from "jwt-decode";
import ProductEditor from "./ProductEditor";
import ConfirmationModal from "../reusable/ConfirmationModal";

export default function ProductManager() {
  const { showAlert } = useAlert();
  const { token } = useAuth();
  const decodedToken = jwtDecode(token);

  const [showProductEditor, setShowProductEditor] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);

  const fetchProductPages = useCallback( async () => {
    try {
      const response = await axios.get(`${ServerUrl}/api/products?size=${itemsPerPage}&page=${currentPage - 1}`);
      if (response.status === 200) {
        const fetchData = response.data.responseList;
        setData(fetchData.products);
        setTotalPages(fetchData.totalPages);
      } else {
        showAlert("Error", "Failed to fetch product data", "danger");
      }
    } catch (error) {
      showAlert("Error", "Failed to fetch product data", "danger");
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(currentPage - 1);
    fetchProductPages();
  }, [fetchProductPages, currentPage, totalPages]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowProductEditor(true);
  };
  const handleHideEditor = () => {
    setSelectedProduct(null);
    setShowProductEditor(false);
  }
  /*----------------------------------------*/
  /*--------PRODUCT DELETION ACTIONS--------*/
  /*----------------------------------------*/
  const handleConfirm = (product) => {
    setShowConfirmDelete(true);
    setSelectedProduct(product);
  }
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${ServerUrl}/api/products/${selectedProduct.id}`);
      if (response.status === 200) {
        showAlert("Success", response.data.message, "success");
        fetchProductPages();
      } else {
        showAlert("Failed", response.data.message || response.data.detail, "danger");
      }
    } catch (error) {
      showAlert("Failed", "Delete request failed", "danger");
    } finally {
      setSelectedProduct(null);
      setShowConfirmDelete(false);
    }
  };
  const handleCancelDelete = () => {
    setSelectedProduct(null);
    setShowConfirmDelete(false);
  };
  /*----------------------------------------*/

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
        <p style={{ fontSize: 18 }}>Product Management</p>
      </div>
      <div className="d-flex justify-content-end   align-items-center mb-3 ">
        <Button onClick={() => setShowProductEditor(true)}>
          <FiPlus /> New Product
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit size={20} />
                  </Button>
                  <Button
                    className="border-0"
                    variant="link"
                    onClick={() => handleConfirm(product)}
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

      {showProductEditor && (<ProductEditor
        fetchData={fetchProductPages}
        isShow={showProductEditor}
        onHide={handleHideEditor}
        product={selectedProduct}
        isInitialMount={true}
      />)}

      {selectedProduct && (
        <ConfirmationModal
          title="Confirmation"
          body={"Are you sure you want to delete the metal ID " + selectedProduct?.id}
          show={showConfirmDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
