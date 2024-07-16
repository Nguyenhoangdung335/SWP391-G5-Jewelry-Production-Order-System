import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Chat from "../chat/MainChat";
import { AiOutlineMessage } from "react-icons/ai";
import { Button } from "react-bootstrap";

export default function UserManagerLayout() {
  const [showChat, setShowChat] = useState(false);
  const [iconState, setIconState] = useState(false);

  const toggleChat = (event) => {
    setShowChat((prev) => !prev);
    setIconState((prev) => !prev);
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
        style={{
          // padding: 0,
          maxHeight: "100vh",
          overflowY: "auto",
          height: "100vh",
        }}
        className="col-10 d-flex flex-column h-100 flex-grow-1"
      >
        {/* <HeaderManager /> */}
        <Outlet />
      </div>
      {showChat && (
        <div
          onClick={toggleChat}
          className="chat-overlay position-fixed d-flex align-content-center justify-content-center h-100 w-100 bg-black bg-opacity-50"
        >
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
    </div>
  );
}
