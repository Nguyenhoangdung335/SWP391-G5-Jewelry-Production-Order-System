import React, { useState } from "react";
import HeaderManager from "./HeaderManager";
import { Outlet } from "react-router-dom";
import SplitPane from "split-pane-react";
import NavBar from "./NavBar";
import Chat from "../chat/MainChat";

export default function UserManagerLayout() {
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <div style={{ height: "100vh", padding: 0, margin: 0 }} className="row">
      <div
        style={{ backgroundColor: "rgb(75, 75, 75)", padding: 0, paddingTop: "2%", }}
        className="col-2 h-full d-flex flex-column  aligin-items-center "
      >
        <NavBar />
      </div>
      <div
        style={{ padding: 0, maxHeight: "100vh", overflowY: "auto" }}
        className="col-10 d-flex flex-column h-100 flex-grow-1"
      >
        {/* <HeaderManager /> */}
        <SplitPane
          split="vertical"
          sizes={showChat ? "20%" : "100%"}
          onChange={() => {
            // Optional: Handle resize events
          }}
        >
          <Outlet />
          {showChat && (
            <div className="chat-content">
              {/* Your Chat component */}
              <div style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
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
      </div>
    </div>
  );
}
