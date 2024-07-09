import React, { useState } from "react";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";
import serverUrl from "../reusable/ServerUrl";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { Container, Form, Button } from "react-bootstrap";

function CreateRequest() {
    const { token } = useAuth();
    const decodedToken = jwtDecode(token);
    const { productSpecId } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requestSent, setRequestSent] = useState(false);

    const handleSubmit = () => {
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
        <Container>
            <h2 className="mt-4">Create Request</h2>
            <Form className="mt-4">
                <Form.Group controlId="formTitle">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formDescription" className="mb-4" >
                    <Form.Label className="mt-4">Description:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="button" onClick={handleSubmit} className="mb-4">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default CreateRequest;
