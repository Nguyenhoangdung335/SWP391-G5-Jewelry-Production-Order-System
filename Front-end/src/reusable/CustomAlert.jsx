import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import './../App.css';

function CustomAlert({ title, text, isShow, onClose, alertVariant, autoCloseTime = 5500 }) {
  const [show, setShow] = useState(isShow);
  const [fade, setFade] = useState('fade-in');

  useEffect(() => {
    if (isShow) {
      setShow(true);
      setFade('fade-in');
      const timer = setTimeout(() => {
        setFade('fade-out');
        setTimeout(() => {
          setShow(false);
          if (onClose) onClose();
        }, 500); // Match this duration with your fade-out animation duration
      }, autoCloseTime);
      return () => clearTimeout(timer);
    } else {
      setFade('fade-out');
      setTimeout(() => setShow(false), 500); // Match this duration with your fade-out animation duration
    }
  }, [isShow, onClose, autoCloseTime]);

  const handleClose = () => {
    setFade('fade-out');
    setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 500); // Match this duration with your fade-out animation duration
  };

  return (
    <Alert
      show={show}
      variant={alertVariant}
      className={`shadow-sm clickable-alert ${fade}`}
      style={alertStyle}
      onClick={handleClose}
    >
      <Alert.Heading style={{fontSize: "1.2rem"}}>{title}</Alert.Heading>
      {text && text.length > 0 && <p style={{fontSize: "1rem"}}>{text}</p>}
    </Alert>
  );
}

const alertStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  width: "50ch",
  zIndex: "1100",
  paddingTop: "10px",
  paddingLeft:"10px",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
};

export default CustomAlert;
