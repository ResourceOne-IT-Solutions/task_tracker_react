import React, { useEffect, useState } from "react";
import { ClientInterface } from "./AddClient";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { ClientModal } from "../../pages/dashboard/adminDashboard/AdminDashboard";
import { UserModal } from "../../components/Authcontext/AuthContext";
import "./AddTicket.css";
import httpMethods from "../../api/Service";

interface TicketInterface {
  client: { name: string; id: string; mobile: string };
  user: { name: string; id: string };
  technology: string;
  description: string;
  targetDate: string;
}

interface ResponseTicketData {
  client: {
    name: string;
    mobile: string;
    id: string;
  };
  conversation: any;
  createdAt: string;
  description: string;
  receivedDate: string;
  status: string;
  targetDate: string;
  technology: string;
  updatedAt: string;
  user: { name: string; id: string };
}
function AddTicket({ clientsData }: ClientModal | any) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ticketData, setTicketData] = useState<TicketInterface>({
    client: { name: "", id: "", mobile: "" },
    user: { name: "", id: "" },
    technology: "",
    description: "",
    targetDate: "",
  });
  const [ticketError, setTicketError] = useState<string>("");
  const [ticketSuccess, setTicketSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdTicket, setCreatedTicket] = useState({});

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    clientsData.forEach((val: ClientModal) => {
      if (val.firstName == item) {
        setTicketData({
          ...ticketData,
          client: { name: item, id: val._id, mobile: val.mobile },
          technology: val.technology,
        });
      }
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicketData({ ...ticketData, [event.target.name]: event.target.value });
  };
  const submitTicketData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    httpMethods
      .post<TicketInterface, ResponseTicketData>("/tickets/create", ticketData)
      .then((result) => {
        setCreatedTicket(result);
        setTicketError("");
        setTimeout(() => {
          setLoading(false);
          setTicketData({
            client: { name: "", id: "", mobile: "" },
            user: { name: "", id: "" },
            technology: "",
            description: "",
            targetDate: "",
          });
          setSelectedItem(null);
          setTicketSuccess(true);
        }, 2000);
      })
      .catch((e: any) => {
        setTicketSuccess(false);
        setLoading(false);
        setTicketError(e.message);
      });
  };
  return (
    <div>
      <Form onSubmit={(e) => submitTicketData(e)}>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedItem ? selectedItem : "Select an Client"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {clientsData !== null
                  ? clientsData.map((item: ClientModal, index: any) => {
                      return (
                        <Dropdown.Item key={index} eventKey={item.firstName}>
                          {item.firstName}
                        </Dropdown.Item>
                      );
                    })
                  : null}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="text"
              placeholder="Enter Technology"
              value={ticketData.technology}
              name="technology"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              as={"textarea"}
              placeholder="Enter Description"
              rows={2}
              name="description"
              onChange={handleChange}
              value={ticketData.description}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="3">
            <Form.Label className="date-label">
              <b>TargetDate</b>
            </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="9">
            <Form.Control
              type="date"
              name="targetDate"
              onChange={handleChange}
              value={ticketData.targetDate}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button variant="primary" type="submit">
              {loading ? "Creating" : "Add Ticket"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {ticketSuccess ? (
          <div className="scc-msg">Ticket Created Successfully</div>
        ) : null}
        {ticketError && <div className="err-msg">{ticketError}</div>}
      </Form>
    </div>
  );
}

export default AddTicket;
