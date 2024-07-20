import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({show, onConfirm, onCancel, title = "Confirm", body = "Are you sure" }) {
  return (
    <Modal show={show} onHide={onCancel} backdrop="true" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
