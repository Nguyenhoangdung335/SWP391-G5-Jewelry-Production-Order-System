import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const sizes = {
  xl: { spinnerSize: "3.5rem", fontSize: "2rem", marginLeft: "2rem", borderWidth: "4px" },
  lg: { spinnerSize: "2.5rem", fontSize: "1.5rem", marginLeft: "1.5rem", borderWidth: "3px" },
  md: { spinnerSize: "2rem", fontSize: "1.25rem", marginLeft: "1rem", borderWidth: "2px" },
  sm: { spinnerSize: "1.5rem", fontSize: "1rem", marginLeft: "0.75rem", borderWidth: "1px" },
};

function Loader({ size }) {
  const { spinnerSize, fontSize, marginLeft, borderWidth } = sizes[size] || sizes.xl;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner
        as="span"
        animation="border"
        role="status"
        aria-hidden="true"
        size="sm"
        style={{ width: spinnerSize, height: spinnerSize, borderWidth: borderWidth }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <span style={{ fontSize, marginLeft }}>Loading...</span>
    </div>
  );
}

export default Loader;
