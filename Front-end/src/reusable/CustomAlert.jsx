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
        width: "30%",
        zIndex: "1050",
        paddingTop: "25px",
        paddingLeft:"25px"
      }}
    >
      <Alert.Heading>{title}</Alert.Heading>
      <p>{text}</p>
    </Alert>
  );
}

export default CustomAlert;
