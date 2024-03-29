import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import "./styles/AddTicket.css";
import httpMethods from "../../api/Service";
import { ClientModal } from "../../modals/ClientModals";
import { CreateTicketModal, TicketModal } from "../../modals/TicketModals";
import { getCurrentDate, getNameId } from "../utils";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import { Severity } from "./notification";
import { ErrorMessageInterface } from "../../modals/interfaces";
import { NEW_TICKET_EMPTY_OBJ } from "../ConstantObjects";
interface TicketmodalInterface {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  clientsData: ClientModal | any;
}

function AddTicket({ setShowModal, clientsData }: TicketmodalInterface) {
  const userContext = useUserContext();
  const { currentUser, alertModal, socket } = userContext as UserContext;
  const [selectedItem, setSelectedItem] = useState(null);
  const [ticketData, setTicketData] =
    useState<CreateTicketModal>(NEW_TICKET_EMPTY_OBJ);
  const [ticketError, setTicketError] = useState<string>("");
  const [ticketSuccess, setTicketSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdTicket, setCreatedTicket] = useState({});

  const isValidFields =
    Boolean(ticketData.client.name) &&
    Boolean(ticketData.technology) &&
    Boolean(ticketData.targetDate) &&
    Boolean(ticketData.description);
  const handleSelect = (item: any) => {
    setSelectedItem(item);
    clientsData.forEach((val: ClientModal) => {
      if (val.firstName == item) {
        setTicketData({
          ...ticketData,
          client: {
            name: item,
            id: val._id,
            mobile: val.mobile,
            email: val.email,
            location: val.location,
          },
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
    if (isValidFields) {
      setLoading(true);
      httpMethods
        .post<CreateTicketModal, TicketModal>("/tickets/create", {
          ...ticketData,
          createdBy: getNameId(currentUser),
        })
        .then((result) => {
          setCreatedTicket(result);
          setTicketError("");
          setLoading(false);
          setTicketData(NEW_TICKET_EMPTY_OBJ);
          setSelectedItem(null);
          setTicketSuccess(true);
          alertModal({
            severity: Severity.SUCCESS,
            content: `Ticket Created succesfully`,
            title: "Alert",
          });
          socket.emit("dashboardStats");
          setShowModal(false);
        })
        .catch((e: ErrorMessageInterface) => {
          setTicketSuccess(false);
          setLoading(false);
          setTicketError(e.message);
          alertModal({
            severity: Severity.ERROR,
            content: e.message,
            title: "Alert",
          });
        });
    } else {
      setTicketError("Enter All Fields");
    }
  };
  return (
    <div>
      <Form onSubmit={(e) => submitTicketData(e)}>
        <Row className="mb-3">
          <Form.Label>
            <b>
              Select A Client <span className="text-danger">*</span>
            </b>
          </Form.Label>
          <Form.Group as={Col} md="12">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic-ticket-client"
              >
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
            <Form.Label>
              <b>
                Enter Technology <span className="text-danger">*</span>
              </b>
            </Form.Label>
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
            <Form.Label>
              <b>
                Add Requirement <span className="text-danger">*</span>
              </b>
            </Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Enter Requirement"
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
              <b>
                TargetDate <span className="text-danger">*</span>
              </b>
            </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="9">
            <Form.Control
              type="date"
              name="targetDate"
              onChange={handleChange}
              value={ticketData.targetDate}
              min={getCurrentDate()}
              max={getCurrentDate(1)}
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
        {ticketError && (
          <div className="err-msg text-danger">{ticketError}</div>
        )}
      </Form>
    </div>
  );
}

export default AddTicket;
