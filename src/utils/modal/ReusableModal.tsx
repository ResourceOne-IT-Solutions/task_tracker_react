import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
interface ClientProps {
  children: React.ReactNode;
  vals: {
    title: string;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
  };
}
function ReusableModal({ vals, children }: ClientProps) {
  const handleClose = () => vals.setShowModal(false);
  return (
    <>
      <Modal show={vals.show} onHide={handleClose} className="">
        <Modal.Header closeButton className="popup-header">
          <Modal.Title>{vals.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Create
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default ReusableModal;
