import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Dropdown } from "react-bootstrap";
import httpMethods from "../../api/Service";
import { AddOnResourcePayload } from "../../modals/TicketModals";

interface AssignTicketProps {
  updateref: any;
  usersData: any;
  UpdateTicketsTableData: (updatedticket: any) => void;
}

function AssignTicket({
  updateref,
  usersData,
  UpdateTicketsTableData,
}: AssignTicketProps) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendingData, setSendingData] = useState<AddOnResourcePayload>({
    id: "",
    data: { addOnResource: { name: "", id: "" } },
  });
  const [assignError, setAssignError] = useState<string>("");
  const [assignSuccess, setAssignSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [afterAssigned, setAfterAssigned] = useState({});
  const handleSelect = (item: any) => {
    setSelectedUser(item);
    usersData.map((_: { firstName: any; _id: any }, idx: any) => {
      if (_.firstName == item) {
        setSendingData({
          ...sendingData,
          data: { addOnResource: { name: _.firstName, id: _._id } },
        });
      }
    });
  };
  useEffect(() => {
    setSendingData({ ...sendingData, id: updateref._id });
  }, []);
  const handleAssignResourse = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedUser) {
      setAssignError("Please Select the User");
      setLoading(false);
    } else {
      httpMethods
        .put<AddOnResourcePayload, any>("/tickets/assign-resource", sendingData)
        .then((result) => {
          setAfterAssigned(result);
          setAssignError("");
          setTimeout(() => {
            setLoading(false);
            setSendingData({
              id: "",
              data: { addOnResource: { name: "", id: "" } },
            });
            setSelectedUser(null);
            UpdateTicketsTableData(result);
            setAssignSuccess(true);
          }, 2000);
        })
        .catch((e: any) => {
          setAssignSuccess(false);
          setLoading(false);
          setAssignError(e.message);
        });
    }
  };

  return (
    <div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            Client Name : {updateref.client.name}
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedUser ? selectedUser : "Select a User"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {usersData !== null
                  ? usersData.map((item: any, index: any) => {
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
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleAssignResourse(e)}
            >
              {loading ? "Assigning" : "Assign Resource"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {assignSuccess ? (
          <div className="scc-msg">Resource Assigned Successfully</div>
        ) : null}
        {assignError && <div className="err-msg">{assignError}</div>}
      </Form>
    </div>
  );
}

export default AssignTicket;
