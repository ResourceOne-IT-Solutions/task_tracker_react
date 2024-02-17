import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import httpMethods from "../../api/Service";
import {
  TicketModal,
  UpdateTicketProps,
  UpdateTicketPayload,
} from "../../modals/TicketModals";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import { getFullName } from "../utils";
import { TICKET_STATUS_TYPES } from "../Constants";

const UpdateTicket: React.FC<UpdateTicketProps> = ({
  show,
  onHide,
  ticketData,
  updateTableData,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    description: "",
    comments: "",
    status: "",
  });
  const userContext = useUserContext();
  const { socket, currentUser } = userContext as UserContext;

  // Update the form data when the ticketData prop changes
  React.useEffect(() => {
    if (ticketData?.client) {
      setFormData({
        clientName: ticketData.client.name,
        description: ticketData.description,
        comments: ticketData.comments,
        status: ticketData.status,
      });
    }
  }, [ticketData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatedTicket: UpdateTicketPayload = {
    description: formData.description,
    comments: formData.comments,
    status: formData.status,
    updatedBy: { id: currentUser._id, name: getFullName(currentUser) },
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    httpMethods
      .put<{ id: string; data: UpdateTicketPayload }, TicketModal>(
        `/tickets/update`,
        { id: ticketData._id, data: updatedTicket },
      )
      .then((result) => {
        updateTableData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ display: "flex", flexDirection: "column", margin: 0 }}>
          {/* Display Client Name */}
          <Form.Group
            controlId="clientName"
            style={{ display: "flex", marginBottom: "10px" }}
          >
            <Form.Label style={{ flex: "0 0 150px" }}>Client Name</Form.Label>
            <div style={{ minWidth: "150px" }}>{formData.clientName}</div>
          </Form.Group>

          {/* Description */}
          <Form.Group
            controlId="description"
            style={{ display: "flex", marginBottom: "10px" }}
          >
            <Form.Label style={{ flex: "0 0 150px" }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ flex: "1", minWidth: "250px" }}
            />
          </Form.Group>

          {/* Comments */}
          <Form.Group
            controlId="comments"
            style={{ display: "flex", marginBottom: "10px" }}
          >
            <Form.Label style={{ flex: "0 0 150px" }}>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              style={{ flex: "1", minWidth: "250px" }}
            />
          </Form.Group>

          {/* Status Dropdown */}
          <Form.Group
            controlId="status"
            style={{ display: "flex", marginBottom: "10px" }}
          >
            <Form.Label style={{ flex: "0 0 150px" }}>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ flex: "1", minWidth: "150px" }}
            >
              <option value={""}>{"Select Status"}</option>
              <option value={TICKET_STATUS_TYPES.IN_PROGRESS}>
                {TICKET_STATUS_TYPES.IN_PROGRESS}
              </option>
              <option value={TICKET_STATUS_TYPES.CLOSED}>
                {TICKET_STATUS_TYPES.CLOSED}
              </option>
              <option value={TICKET_STATUS_TYPES.PENDING}>
                {TICKET_STATUS_TYPES.PENDING}
              </option>
              <option value={TICKET_STATUS_TYPES.IMPROPER_REQUIRMENT}>
                {TICKET_STATUS_TYPES.IMPROPER_REQUIRMENT}
              </option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Update Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateTicket;
