import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputPrice, MetalForm } from "../orderFlows/DesignOptionForms";
import { useAlert } from "../provider/AlertProvider";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

const MetalEditor = ({isShow, metalData = null, onHide, fetchData}) => {
    const {showAlert} = useAlert();
    const metalFormRef = useRef(null);
    const companyPriceRef = useRef(null);
    const marketPriceRef = useRef(null);
    const [selectedMetalProp, setSelectedMetalProp] = useState({
        selectedMetalId: "",
        selectedMetalName: "",
        selectedMetalUnit: "",
        selectedCompanyPrice: 0.0,
        selectedMarketPrice: 0.0,
        selectedMetal: metalData,
    });

    useEffect(() => {
        setSelectedMetalProp({
            selectedMetalId: metalData?.id || "",
            selectedMetalName: metalData?.name || "",
            selectedMetalUnit: metalData?.unit || "",
            selectedCompanyPrice: metalData?.companyPrice || 0.0,
            selectedMarketPrice: metalData?.marketPrice || 0.0,
            selectedMetal: metalData,
        });
    }, [metalData, isShow]);

    const handleChangeMetal = useCallback((e) => {
        const { name, value } = e.target;
        setSelectedMetalProp((prev) => ({...prev, [name]: value}));
    }, []);

    const handleSubmit = async () => {
        if (metalFormRef.current && companyPriceRef.current && marketPriceRef && typeof metalFormRef.current.validate === 'function') {
            const isMetalFormValid = metalFormRef.current.validate();
            const isCompanyPriceValid = companyPriceRef.current.validate();
            const isMarketPriceValid = marketPriceRef.current.validate();

            if (isMetalFormValid && isCompanyPriceValid && isMarketPriceValid) {
                metalData = {
                    ...metalData,
                    name: selectedMetalProp.selectedMetalName,
                    unit: selectedMetalProp.selectedMetalUnit,
                    companyPrice: selectedMetalProp.selectedCompanyPrice,
                    marketPrice: selectedMetalProp.selectedMarketPrice,
                }

                let request = null;
                if (selectedMetalProp?.id && selectedMetalProp?.id !== "")
                    request = {...updateRequest, data: metalData};
                else
                    request ={...createRequest, data: metalData};

                const response = await axios.request(request);
                if (response.status === 200) {
                    if (fetchData)
                        fetchData();
                    showAlert("Successful", response.data.message, "success");
                    onHide();
                } else {
                    showAlert("Error", response.data.message || response.data.detail, "danger");
                }

            } else {
                showAlert("Warning", "Please verify data", "warning");
            }
        } else {
            console.error('MetalForm ref is not available or validate method is not a function');
        }
    };

    return (
        <Modal size="lg" fullscreen="md-down" centered keyboard animation scrollable show={isShow} >
            <Modal.Header closeButton style={{ width: "100%", }} onHide={onHide} ><h4>Metal Editor</h4></Modal.Header>
            <Modal.Body style={{ width: "100%", }}>
                <MetalForm
                    ref={metalFormRef}
                    selectedMetalData={selectedMetalProp}
                    onChange={handleChangeMetal}
                    isEditing={true}
                />
                <Container>
                    <Row>
                        <Col sm={12} md={6}>
                            <InputPrice
                                label="Company Price"
                                minVal={0.0}
                                maxVal={1000000.0}
                                onChange={handleChangeMetal}
                                propName="selectedCompanyPrice"
                                value={selectedMetalProp.selectedCompanyPrice}
                                ref={companyPriceRef}
                            />
                        </Col>
                        <Col sm={12} md={6}>
                            <InputPrice
                                label="Market Price"
                                minVal={0.0}
                                maxVal={1000000.0}
                                onChange={handleChangeMetal}
                                propName="selectedMarketPrice"
                                value={selectedMetalProp.selectedMarketPrice}
                                ref={marketPriceRef}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button type={"button"} onClick={onHide}>Cancel</Button> {"     "}
                <Button type={"button"} onClick={handleSubmit}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}

const createRequest = {
    method: "POST",
    url: `${ServerUrl}/api/metal`,
    headers: {
      "content-type": "application/json",
    },
    data: null,
};

const updateRequest = {
    method: "PUT",
    url: `${ServerUrl}/api/metal`,
    headers: {
      "content-type": "application/json",
    },
    data: null,
};

export default MetalEditor;