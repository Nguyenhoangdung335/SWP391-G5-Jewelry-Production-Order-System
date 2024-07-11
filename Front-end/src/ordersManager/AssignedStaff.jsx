import axios from "axios";
import { useEffect, useState } from "react";
import ServerUrl from "../reusable/ServerUrl";
import {
  Button,
  Form,
  Row,
} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";

function AssignedStaff({ data, onSubmit }) {
    const { token } = useAuth();
  
    const [staff, setStaff] = useState({
      saleStaffs: [],
      designStaffs: [],
      productionStaffs: [],
    });
  //   const [loading, setLoading] = useState(true);
    // const [staffOptions, setStaffOptions] = useState();
    const [selectedSaleStaff, setSelectedSaleStaff] = useState(data.saleStaff?.id || '');
    const [selectedDesignStaff, setSelectedDesignStaff] = useState(data.designStaff?.id || '');
    const [selectedProductionStaff, setSelectedProductionStaff] = useState(data.productionStaff?.id || '');
  
    useEffect(() => {
      const decodedToken = jwtDecode(token);
      const fetchStaff = async () => {
        try {
          const response = await axios.get(`${ServerUrl}/api/admin/get/staff?role=${decodedToken.role}`);
          setStaff(response.data.responseList);
        } catch (error) {
          console.error("Error fetching staff data:", error);
        }
      };
  
      fetchStaff();
    }, [data]);
  
    const handleSubmit = () => {
      const updatedStaff = {
        saleStaffID: selectedSaleStaff,
        designStaffID: selectedDesignStaff,
        productionStaffID: selectedProductionStaff,
      };
      onSubmit(updatedStaff);
    };
  
    return (
      <Row className="pb-2">
        <div style={{ border: "1px solid rgba(166, 166, 166, 0.5)" }}>
          <div className="p-2">
            <div
              className="mb-2"
              style={{
                borderBottom: "1px solid rgba(166, 166, 166, 0.5)",
              }}
            >
              <h4>Assigned Staff</h4>
            </div>
            <Form.Group controlId="formSaleStaff">
              <Form.Label>Sale Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedSaleStaff}
                onChange={(e) => setSelectedSaleStaff(e.target.value)}
                disabled={staff?.saleStaffs === null}
              >
                <option value="">{staff === null ? "Loading..." : "Select Sale Staff"}</option>
                {staff.saleStaffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.userInfo.firstName} {staff.userInfo.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDesignStaff">
              <Form.Label>Design Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedDesignStaff}
                onChange={(e) => setSelectedDesignStaff(e.target.value)}
                disabled={staff?.designStaffs === null}
              >
                <option value="">{staff === null ? "Loading..." : "Select Design Staff"}</option>
                {staff.designStaffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.userInfo.firstName} {staff.userInfo.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProductionStaff">
              <Form.Label>Production Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedProductionStaff}
                onChange={(e) => setSelectedProductionStaff(e.target.value)}
                disabled={staff?.productionStaffs === null}
              >
                <option value="">{staff === null ? "Loading..." : "Select Production Staff"}</option>
                {staff.productionStaffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.userInfo.firstName} {staff.userInfo.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button className="mt-3" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Row>
    );
  }

export default AssignedStaff;