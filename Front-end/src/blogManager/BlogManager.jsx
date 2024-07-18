import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

export default function BlogManager() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [deleteBlog, setDeleteBlog] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [blogs, setBlogs] = useState([
    {
      id: "BL_0001",
      title:
        "Customer engagement ring trends: elevating personal expressions of love",
      tag: "#engagement #rings #trends",
    },
    {
      id: "BL_0002",
      title: "How to clean your jewelry at home",
      tag: "#cleaning gemstones #cleaning gold jewelry #cleaning platinum jewelry #cleaning silver jewelry #custom jewelry",
    },
    {
      id: "BL_0003",
      title:
        "Customer engagement ring trends: elevating personal expressions of love",
      tag: "#engagement #rings #trends",
    },
    {
      id: "BL_0004",
      title:
        "Customer engagement ring trends: elevating personal expressions of love",
      tag: "#engagement #rings #trends",
    },
    {
      id: "BL_0005",
      title: "Jim Green",
      tag: "#cleaning gemstones #cleaning gold jewelry #cleaning platinum jewelry #cleaning silver jewelry #custom jewelry",
    },
    {
      id: "BL_0006",
      title: "Joe Black",
      tag: "#cleaning gemstones #cleaning gold jewelry #cleaning platinum jewelry #cleaning silver jewelry #custom jewelry",
    },
    {
      id: "BL_0007",
      title:
        "Customer engagement ring trends: elevating personal expressions of love",
      tag: "#engagement #rings #trends",
    },
    {
      id: "BL_0008",
      title: "Jim Green",
      tag: "#cleaning gemstones #cleaning gold jewelry #cleaning platinum jewelry #cleaning silver jewelry #custom jewelry",
    },
    {
      id: "BL_0009",
      title: "Joe Black",
      tag: "#cleaning gemstones #cleaning gold jewelry #cleaning platinum jewelry #cleaning silver jewelry #custom jewelry",
    },
  ]);

  const handleEditClick = (record) => {
    setCurrentBlog(record);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteClick = (record) => {
    setDeleteBlog(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setBlogs(blogs.filter((blog) => blog.id !== deleteBlog.id));
    setDeleteModalVisible(false);
    setDeleteBlog(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteBlog(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const tags =
    "#engagement #rings #trends #cleaning #gemstones #cleaning #gold #jewelry #cleaning #platinum #jewelry #cleaning #silver #jewelry #custom #jewelry";

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
        .new-blog-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 5px 20px;
          background-color: rgba(101, 101, 101, 1);
          gap: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .new-blog-button:hover {
          background-color: #007bff;
        }
      `}</style>
      <Modal size="lg" show={open} onHide={() => setOpen(false)}>
        <Modal.Header>
          <Modal.Title>{isEditing ? "Edit Blog" : "New Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="text-sm mb-1 pl-1">Title</div>
            <textarea
              className="form-control"
              defaultValue={isEditing ? currentBlog?.title : ""}
            ></textarea>
          </div>
          <div className="mb-3">
            <div className="text-sm mb-1 pl-1">Tags</div>
            <select className="form-select">
              {tags.split(" ").map((tag) => (
                <option
                  key={tag}
                  selected={isEditing && currentBlog?.tag.includes(tag)}
                >
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <div className="text-sm mb-1 pl-1">Content</div>
            <Editor
              className="form-control"
              apiKey="rxzla8t3gi19lqs86mqzx01taekkxyk5yyaavvy8rwz0wi83"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              initialValue={isEditing ? currentBlog?.content : ""}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Save Changes
          </Button>
          <Button
            variant="dark"
            onClick={() => navigate("/order_page")}
            style={{ marginLeft: "auto" }}
          >
            Create Your Dream Jewelry.
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteModalVisible} onHide={handleCancelDelete} centered>
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this blog?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            <FaTrash />
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="mb-2">
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          Welcome, Admin!
        </p>
        <p style={{ fontSize: 18 }}>Blogs Management</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
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
          <div
            onClick={() => {
              setIsEditing(false);
              setCurrentBlog(null);
              setOpen(true);
            }}
          >
            <Button
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FiPlus />
              New Blog
            </Button>
          </div>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Tag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBlogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.id}</td>
              <td>{blog.title}</td>
              <td>{blog.tag}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button variant="link" onClick={() => handleEditClick(blog)}>
                    <FaEdit size={20} />
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => handleDeleteClick(blog)}
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
          disabled={currentPage === 1}
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
          disabled={currentPage === totalPages}
        >
          &gt;
        </div>
      </div>
    </div>
  );
}
