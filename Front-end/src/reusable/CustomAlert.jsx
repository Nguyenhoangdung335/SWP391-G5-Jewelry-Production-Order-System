import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { ZAxis } from 'recharts';

function CustomAlert({ text, isShow, onClose }) {
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
    <Alert show={show} variant="light" transition style={{
        position: "fixed", top: "20px",right: "20px", width: "300px", height: "150px", zIndex: "1050", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"
    }}>
      <Alert.Heading>My Alert</Alert.Heading>
      <p>
        {text}
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={handleClose} variant="outline-success">
          Close
        </Button>
      </div>
    </Alert>
  );
}

export default CustomAlert;
