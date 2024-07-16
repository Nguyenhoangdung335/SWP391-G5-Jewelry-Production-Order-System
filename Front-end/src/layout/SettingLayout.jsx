import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { Button, Col, Container, Row } from "react-bootstrap";
import SplitPane, { Pane } from "split-pane-react";
import Chat from "../chat/MainChat";
import { AiOutlineMessage } from "react-icons/ai";

function SettingPageLayout() {
  const [showChat, setShowChat] = useState(false);
  const [iconState, setIconState] = useState(false);

  const toggleChat = () => {
    setShowChat((prev) => !prev);
    setIconState((prev) => !prev);
  };

  return (
    <>
      <Row>
        <Col md={2}>
          <SideBar />
        </Col>
        <Col md={10}>
          <Container className="d-flex justify-content-center w-100 h-100">
            <Outlet />
          </Container>
        </Col>
        {showChat && (
          <div className="chat-overlay position-fixed d-flex align-content-center justify-content-center h-100 w-100 bg-black bg-opacity-50">
            {/* Your Chat component */}
            <Chat />
          </div>
        )}
        <Button
          className="toggle-chat-btn"
          variant={iconState ? "dark" : "outline-dark"}
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "3vh",
            right: "30px",
            width: "50px",
            height: "50px",
            borderRadius: "100%",
          }}
        >
          <AiOutlineMessage size="25px" />
        </Button>
      </Row>
    </>
  );
}

export default SettingPageLayout;
