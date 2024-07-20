import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import './../App.css';

function CustomAlert({ title, text, isShow, onClose, alertVariant, autoCloseTime = 5500 }) {
  const [show, setShow] = useState(isShow);

  useEffect(() => {
    setShow(isShow);
    if (isShow) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) {
          onClose();
        }
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isShow, onClose, autoCloseTime]);

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
      className="shadow-sm clickable-alert"
      style={alertStyle}
      onClick={handleClose}
    >
      <Alert.Heading>{title}</Alert.Heading>
      <p>{text}</p>
    </Alert>
  );
}

const alertStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  width: "30%",
  zIndex: "1100",
  paddingTop: "25px",
  paddingLeft:"25px",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
};



export default CustomAlert;
