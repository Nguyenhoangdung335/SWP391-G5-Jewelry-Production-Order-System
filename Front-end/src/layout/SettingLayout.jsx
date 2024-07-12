import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { Col, Container, Row } from "react-bootstrap";
import SplitPane from "split-pane-react";
import Chat from "../chat/MainChat";

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
        <SplitPane
          split="vertical"
          sizes={showChat ? "20%" : "100%"}
          onChange={() => {
            // Optional: Handle resize events
          }}
        >
          <Container className="d-flex justify-content-center w-100 h-100">
            <Outlet />
          </Container>
          {showChat && (
            <div className="chat-content">
              {/* Your Chat component */}
              <div style={{ backgroundColor: "#f0f0f0", padding: "10px", }}>
                <Chat />
              </div>
            </div>
          )}
        </SplitPane>
        <button
          className="toggle-chat-btn"
          onClick={toggleChat}
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
        >
          {showChat ? "Hide Chat" : "Show Chat"}
        </button>
      </Col>
    </Row>
  );
}

export default SettingPageLayout;
