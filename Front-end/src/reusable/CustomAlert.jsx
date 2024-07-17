import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { ZAxis } from "recharts";

function CustomAlert({ title, text, isShow, onClose, alertVariant }) {
  const [show, setShow] = useState(isShow);

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Alert
      show={show}
      variant={alertVariant}
      transition
      className="shadow-sm"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "40%",
        zIndex: "1050",
        padding: "9px",
      }}
    >
      <Alert.Heading>{title}</Alert.Heading>
      <p>{text}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => setShow(false)}
          variant={`outline-${alertVariant}`}
        >
          Close me
        </Button>
      </div>
    </Alert>
  );
}

export default CustomAlert;
