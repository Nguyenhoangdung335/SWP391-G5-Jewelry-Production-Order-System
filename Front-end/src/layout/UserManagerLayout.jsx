import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Chat from "../chat/MainChat";
import { AiOutlineMessage } from "react-icons/ai";
import { Button } from "react-bootstrap";

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

                {showChat && (
                    <div className="chat-overlay position-fixed d-flex align-center mt-4">
                        {/* Your Chat component */}
                        <Chat />
                    </div>
                )}
            </div>
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
                {/* {showChat ? "Hide Chat" : "Show Chat"} */}

                <AiOutlineMessage size="25px" />
            </Button>
        </div>
    );
}
