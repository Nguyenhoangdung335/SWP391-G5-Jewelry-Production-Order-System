import React, { useState } from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import serverUrl from "../reusable/ServerUrl";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { Form, Button } from "react-bootstrap";

function CreateRequest({productSpecId}) {
    const { token } = useAuth();
    const decodedToken = jwtDecode(token);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requestSent, setRequestSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const request = {
            title,
            description,
            type: "REQUEST",
            senderId: decodedToken.id,
            reportContentID: String(productSpecId),
        };

        axios
            .post(serverUrl + `/api/report/${decodedToken.id}/${productSpecId}/create/request`, request)
            .then((response) => {
                console.log(response.data);
                alert("Request sent successfully!");
                setRequestSent(true);
            })
            .catch((error) => {
                console.error("There was an error sending the request!", error);
                alert("Error sending request.");
            });
    };

    if (requestSent) {
        return <Navigate to="/" />;
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required={true}
                    style={{ width: "100%" }}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required={true}
                    style={{ width: "100%" }}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Confirm
            </Button>
        </Form>
    );
}

export default CreateRequest;