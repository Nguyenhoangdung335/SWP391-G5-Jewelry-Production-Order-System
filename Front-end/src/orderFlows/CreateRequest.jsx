import React, {useState} from "react";
import axios from "axios";
import serverUrl from "../reusable/ServerUrl";
import {useAuth} from "../provider/AuthProvider";
import {jwtDecode} from "jwt-decode";
import {Form, Button} from "react-bootstrap";
import CustomAlert from "../reusable/CustomAlert";

function CreateRequest({productSpecId, onClose}) {
    const {token} = useAuth();
    const decodedToken = jwtDecode(token);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        text: "",
        isShow: false,
        alertVariant: "primary",
    });

    // const handleValidate = () => {
    //     const newErrors = {};
    //     if (!title.trim()) {
    //         newErrors.title = "Title is required.";
    //     }

    //     if (!description.trim()) {
    //         newErrors.description = "Description is required.";
    //     }
    //     setErrors(newErrors);

    //     if (Object.keys(newErrors).length === 0) {
    //         setValidated(true);
    //         return true;
    //     }
    //     return false;
    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validated) return;

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
                setAlertConfig({
                    title: "Success",
                    text: "Request sent successfully!",
                    isShow: true,
                    alertVariant: "success",
                });
                setTimeout(() => onClose(), 2000);
            })
            .catch((error) => {
                console.error("There was an error sending the request!", error);
                setAlertConfig({
                    title: "Error",
                    text: "Error sending request.",
                    isShow: true,
                    alertVariant: "danger",
                });
            });
    };

    const validateTitle = (title) => {
        return title.trim();
    }

    const validateDescription = (description) => {
        return description.trim();
    }

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        const isValidated = validateTitle(newTitle);
        setValidated(isValidated);
        setErrors((prevErrors) => ({...prevErrors, title: (isValidated) ? undefined : "Title is required."}));
    };

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        const isValidated = validateDescription(newDescription);
        setValidated(isValidated);
        setErrors((prevErrors) => ({
            ...prevErrors,
            description: (isValidated) ? undefined : "Description is required."
        }));
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleSubmit} style={{width: "100%"}}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={handleTitleChange}
                        required={true}
                        isInvalid={!!errors.title}
                        style={{width: "100%"}}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={handleDescriptionChange}
                        required={true}
                        isInvalid={!!errors.description}
                        style={{width: "100%", height: "45%"}}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.description}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Confirm
                </Button>
            </Form>
            <CustomAlert
                title={alertConfig.title}
                text={alertConfig.text}
                show={alertConfig.isShow}
                onClose={() => setAlertConfig({...alertConfig, isShow: false})}
                variant={alertConfig.alertVariant}
            />
        </>
    );
}

export default CreateRequest;