import axios from "axios";
import { useEffect, useState } from "react";
import ServerUrl from "../../reusable/ServerUrl";
import { Button, Form } from "react-bootstrap";

function AssignedStaff({ decodedToken, data, onSubmit }) {
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

  const isQualifiedAssigningStaff =
      decodedToken &&
      ["MANAGER", "ADMIN"].includes(decodedToken.role) &&
      data.status === "AWAIT_ASSIGN_STAFF";

  useEffect(() => {
    if (isQualifiedAssigningStaff) {
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
  }, [isQualifiedAssigningStaff]);

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
              isQualified={isQualifiedAssigningStaff}
              staffOptions={staff.saleStaffs}
              controlId="formSaleStaff"
            />
          <StaffField
              label="Design Staff"
              value={selectedDesignStaff}
              onChange={(e) => setSelectedDesignStaff(e.target.value)}
              disabled={staff?.designStaffs === null}
              isQualified={isQualifiedAssigningStaff}
              staffOptions={staff.designStaffs}
              controlId="formDesignStaff"
            />
            <StaffField
              label="Production Staff"
              value={selectedProductionStaff}
              onChange={(e) => setSelectedProductionStaff(e.target.value)}
              disabled={staff?.productionStaffs === null}
              isQualified={isQualifiedAssigningStaff}
              staffOptions={staff.productionStaffs}
              controlId="formProductionStaff"
            />
          {isQualifiedAssigningStaff &&
          <Button className="mt-3" onClick={handleSubmit}>
            Submit
          </Button>
          }
        </div>
      </div>
    </>
  );
}

function StaffField({label, value, onChange, disabled, isQualified, staffOptions, controlId}) {
 return (
    <>
      {isQualified &&
        <Form.Group controlId={controlId}>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            as="select"
            value={value}
            onChange={onChange}
            disabled={disabled}
          >
            <option value="">
              {staffOptions === null ? "Loading..." : `Select ${label}`}
            </option>
            {staffOptions.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.id}-{staff.userInfo?.firstName} {staff.userInfo?.lastName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      }
      {!isQualified && <Form.Group>
        <Form.Group controlId={controlId} className="d-flex justify-content-between">
          <Form.Label style={{minWidth: "32%"}}>{label}</Form.Label>
          <Form.Control style={{textAlign: "right"}}
            as="input"
            plaintext readOnly
            value={(value) ?(value.id + "-" + value.userInfo?.firstName + " " +  value.userInfo?.lastName) : "NaN"}
          />
        </Form.Group>
      </Form.Group>}
    </>
  );
}

export default AssignedStaff;
