import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { TicketsModal } from "../../pages/dashboard/userDashboard/UserDashboard";
import httpMethods from "../../api/Service";

interface UpdateTicketProps {
  show: boolean;
  onHide: () => void;
  ticketData: TicketsModal;
}
interface UpdatePayload {
  description: string;
  comments: string;
  status: string;
}

const UpdateTicket: React.FC<UpdateTicketProps> = ({
  show,
  onHide,
  ticketData,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    description: "",
    comments: "",
    status: "PROGRESS",
  });

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
  const [tableData, setTableData] = useState<TicketsModal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatedTicket: UpdatePayload = {
    description: formData.description,
    comments: formData.comments,
    status: formData.status,
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    httpMethods
      .put<{ id: string; data: UpdatePayload }, TicketsModal>(
        `/tickets/update`,
        { id: ticketData._id, data: updatedTicket },
      )
      .then((result) => {
        const data = tableData.map((user) => {
          if (user._id == result._id) {
            return result;
          }
          return user;
        });
        setTableData(data);
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
              <option value="PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="PENDING">Pending</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Update Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateTicket;
