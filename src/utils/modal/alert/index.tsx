import React from "react";
import { Severity } from "../notification";
import { Modal, Button } from "react-bootstrap";
interface AlertProps {
  content: string;
  severity: Severity;
  title?: string;
  onClose: (status: boolean) => void;
  show: boolean;
}

const Alert = ({
  content,
  severity,
  title = "Alert",
  onClose,
  show,
}: AlertProps) => {
  const handleClose = () => {
    onClose(false);
  };
  return (
    <Modal
      show={show}
      className={`notification text-center ${severity}`}
      onHide={handleClose}
    >
      <Modal.Header onClick={handleClose} closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="content">{content}</Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button onClick={handleClose}>Okay</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Alert;
