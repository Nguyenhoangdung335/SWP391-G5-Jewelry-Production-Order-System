import React, { useState } from "react";
import HeaderManager from "./HeaderManager";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Chat from "../chat/MainChat";

export default function UserManagerLayout() {
  const [showChat, setShowChat] = useState(false);

  const toggleChat = (event) => {
    setShowChat((prev) => !prev);
  };

  return (
    <div style={{ height: "100vh", padding: 0, margin: 0 }} className="row">
      <div
        style={{
          backgroundColor: "rgb(75, 75, 75)",
          padding: 0,
          paddingTop: "2%",
        }}
        className="col-2 h-full d-flex flex-column  aligin-items-center "
      >
        <NavBar />
      </div>
      <div
        style={{ padding: 0, maxHeight: "100vh", overflowY: "auto", height: "100vh" }}
        className="col-10 d-flex flex-column h-100 flex-grow-1"
      >
        {/* <HeaderManager /> */}
        <Outlet />
      </div>
      {showChat && (
        <div
          className="chat-overlay"
          style={{
            position: "absolute",
            right: "0",
            width: "300px",
            height: "98vh",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          {/* Your Chat component */}
          <Chat />
        </div>
      )}
      <button
        className="toggle-chat-btn"
        onClick={toggleChat}
        style={{ 
          position: "fixed", 
          bottom: "20px", 
          right: showChat ? "340px" : "20px", 
          width: "auto", 
          transition: "right 0.3s ease" 
        }}
      >
        {showChat ? "Hide Chat" : "Show Chat"}
      </button>
    </div>
  );
}
