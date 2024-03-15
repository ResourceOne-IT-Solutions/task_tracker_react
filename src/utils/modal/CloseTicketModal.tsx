import React, { useState } from "react";
import { Form, Row, Col, Button, Dropdown } from "react-bootstrap";
import { RED_STAR, TICKET_STATUS_TYPES } from "../Constants";
import httpMethods from "../../api/Service";
import { getNameId } from "../utils";
import { Severity } from "./notification";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";

function CloseTicketModal({
  updateReference,
  setShowModal,
  updateTicketsTable,
}: any) {
  const { alertModal, currentUser } = useUserContext() as UserContext;
  const [selectedItem, setSelectedItem] = useState("");
  const [description, setDescription] = useState("");
  const [closeError, setCloseError] = useState<string>("");
  const [closeSuccess, setCloseSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ischecked, setIsChecked] = useState<boolean>(false);
  const handleSelect = (item: any) => {
    setSelectedItem(item);
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCloseError("");
    let data;
    const updateTicket = (data: any) => {
      setLoading(true);
      httpMethods
        .put<any, any>("/tickets/update", {
          id: updateReference._id,
          data,
        })
        .then((res) => {
          updateTicketsTable(res);
          setCloseSuccess(true);
          setTimeout(() => {
            setShowModal(false);
          });
        })
        .catch((err: any) => {
          alertModal({
            severity: Severity.ERROR,
            content: err.message,
            title: "Ticket Update",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
    if (ischecked) {
      if (description && selectedItem) {
        data = {
          isClosed: !updateReference.isClosed,
          description,
          status: selectedItem,
          updatedBy: getNameId(currentUser),
        };
        updateTicket(data);
      } else {
        setCloseError("Description and Status required");
      }
    } else {
      data = {
        isClosed: !updateReference.isClosed,
        updatedBy: getNameId(currentUser),
      };
      updateTicket(data);
    }
  };
  return (
    <div>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <p>This Ticket is in {updateReference.status} Status.</p>
        <div className="d-flex">
          <p>Do you want to add Description? </p>
          <Form.Check
            type="switch"
            id="custom-switch"
            label=""
            checked={ischecked}
            onChange={() => setIsChecked(!ischecked)}
          />
        </div>
        {ischecked && (
          <>
            <Row className="mb-3">
              <Form.Label>
                <b>
                  Select A Client <RED_STAR />
                </b>
              </Form.Label>
              <Form.Group as={Col} md="12">
                <Dropdown onSelect={handleSelect}>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic-ticket-client"
                  >
                    {selectedItem ? selectedItem : "Select Status"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{ maxHeight: "180px", overflowY: "auto" }}
                  >
                    {Object.values(TICKET_STATUS_TYPES).map(
                      (stat: string, ind: number) => {
                        return (
                          <Dropdown.Item key={ind} eventKey={stat}>
                            {stat}
                          </Dropdown.Item>
                        );
                      },
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12">
                <Form.Label>
                  <b>
                    Enter Description <RED_STAR />
                  </b>
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  placeholder="Enter Description"
                  rows={2}
                  name="description"
                  onChange={handleChange}
                  value={description}
                />
              </Form.Group>
            </Row>
          </>
        )}
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button variant="primary" type="submit">
              {loading
                ? "Updating..."
                : updateReference.isClosed
                  ? "Reopen Ticket"
                  : "Close Ticket"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {closeSuccess && (
          <div className="scc-msg">
            Ticket {updateReference.isClosed ? "Reopened" : "Closed"}{" "}
            Successfully
          </div>
        )}
        {closeError && <div className="err-msg text-danger">{closeError}</div>}
      </Form>

      {/* <Form>
        <Row className="mb-3">
          <Form.Label>
            <b>Select A Client</b>
          </Form.Label>
          <Form.Group as={Col} md="12">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic-ticket-client"
              >
                {selectedItem ? selectedItem : "Select Status"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {Object.values(TICKET_STATUS_TYPES).map(
                  (stat: string, ind: number) => {
                    return (
                      <Dropdown.Item key={ind} eventKey={stat}>
                        {stat}
                      </Dropdown.Item>
                    );
                  },
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>
              <b>Enter Description</b>
            </Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Enter Description"
              rows={2}
              name="description"
              //   onChange={handleChange}
              //   value={ticketData.description}
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
        {closeSuccess ? (
          <div className="scc-msg">Ticket Closed Successfully</div>
        ) : null}
        {closeError && <div className="err-msg text-danger">{closeError}</div>}
      </Form> */}
    </div>
  );
}

export default CloseTicketModal;
