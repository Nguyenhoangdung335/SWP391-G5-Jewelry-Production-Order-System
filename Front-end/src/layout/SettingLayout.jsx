import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { Button, Col, Container, Row } from "react-bootstrap";
import SplitPane, { Pane } from "split-pane-react";
import Chat from "../chat/MainChat";
import { AiOutlineMessage } from "react-icons/ai";

function SettingPageLayout() {
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <Row>
      <Col md={3}>
        <div className="position-fixed w-25">
          <SideBar />
        </div>
      </Col>
      <Col md={9}>
        <Container className="d-flex justify-content-center w-100 h-100">
          <Outlet />
        </Container>
      </Col>
      {showChat && (
        // <div className="chat-content position-fixed">
        <div
          className="position-fixed mt-4 mb-4"
          style={{ margin: "0px auto" }}
        >
          <Chat />
        </div>
        // </div>
      )}
      <Button
        className="toggle-chat-btn"
        variant="outline-dark"
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "3vh",
          right: "30px",
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          transition: "right 0.3s ease",
        }}
      >
        <AiOutlineMessage size="25px" />
      </Button>
    </Row>
  );
}

export default SettingPageLayout;
