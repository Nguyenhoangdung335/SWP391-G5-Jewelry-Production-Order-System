import axios from "axios";
import { useEffect, useState } from "react";
import ServerUrl from "../../reusable/ServerUrl";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../provider/AuthProvider";

function AssignedStaff({ decodedToken, data, onSubmit }) {
  const { token } = useAuth();

  const [staff, setStaff] = useState({
    saleStaffs: [],
    designStaffs: [],
    productionStaffs: [],
  });
  //   const [loading, setLoading] = useState(true);
  // const [staffOptions, setStaffOptions] = useState();
  const [selectedSaleStaff, setSelectedSaleStaff] = useState(
    data.saleStaff ?? ""
  );
  const [selectedDesignStaff, setSelectedDesignStaff] = useState(
    data.designStaff ?? ""
  );
  const [selectedProductionStaff, setSelectedProductionStaff] = useState(
    data.productionStaff ?? ""
  );

  useEffect(() => {
    if (decodedToken) {
      if (["MANAGER", "ADMIN"].includes(decodedToken.role)) {
        const fetchStaff = async () => {
          try {
            const response = await axios.get(
              `${ServerUrl}/api/admin/get/staff?role=${decodedToken.role}`
            );
            setStaff(response.data.responseList);
          } catch (error) {
            console.error("Error fetching staff data:", error);
          }
        };

        fetchStaff();
      }
    }
  }, [decodedToken]);

  const handleSubmit = () => {
    const updatedStaff = {
      saleStaffID: selectedSaleStaff,
      designStaffID: selectedDesignStaff,
      productionStaffID: selectedProductionStaff,
    };
    onSubmit(updatedStaff);
  };

  return (
    <>
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
          <StaffField
            label="Sale Staff"
            value={selectedSaleStaff}
            onChange={(e) => setSelectedSaleStaff(e.target.value)}
            disabled={staff?.saleStaffs === null}
            role={decodedToken?.role}
            staffOptions={staff.saleStaffs}
            controlId="formSaleStaff"
          />
          <StaffField
            label="Design Staff"
            value={selectedDesignStaff}
            onChange={(e) => setSelectedDesignStaff(e.target.value)}
            disabled={staff?.designStaffs === null}
            role={decodedToken?.role}
            staffOptions={staff.designStaffs}
            controlId="formDesignStaff"
          />
          <StaffField
            label="Production Staff"
            value={selectedProductionStaff}
            onChange={(e) => setSelectedProductionStaff(e.target.value)}
            disabled={staff?.productionStaffs === null}
            role={decodedToken?.role}
            staffOptions={staff.productionStaffs}
            controlId="formProductionStaff"
          />
          {decodedToken &&
            ["MANAGER", "ADMIN"].includes(decodedToken?.role) && (
              <div className="w-100 d-flex justify-content-end pb-2">
                <Button className="mt-3" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

function StaffField(props) {
  const isAuthorized = ["MANAGER", "ADMIN"].includes(props.role);
  // const chosenStaff = props.staffOptions.find(staff => staff.id === props.value);

  return (
    <>
      {isAuthorized && (
        <Form.Group controlId={props.controlId}>
          <Form.Label>{props.label}</Form.Label>
          <Form.Control
            as="select"
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
          >
            <option value="">
              {props.staffOptions === null
                ? "Loading..."
                : `Select ${props.label}`}
            </option>
            {props.staffOptions.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.id}-{staff.userInfo?.firstName}{" "}
                {staff.userInfo?.lastName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
      {!isAuthorized && (
        <Form.Group>
          <Form.Group
            controlId={props.controlId}
            className="d-flex justify-content-between"
          >
            <Form.Label style={{ minWidth: "32%" }}>{props.label}</Form.Label>
            <Form.Control
              style={{ textAlign: "right" }}
              as="input"
              plaintext
              readOnly
              value={
                props.value
                  ? props.value.id +
                    "-" +
                    props.value.userInfo.firstName +
                    " " +
                    props.value.userInfo.lastName
                  : "Pending"
              }
            />
          </Form.Group>
        </Form.Group>
      )}
    </>
  );
}

export default AssignedStaff;
