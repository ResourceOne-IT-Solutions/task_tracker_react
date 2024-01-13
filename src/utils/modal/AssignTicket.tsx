import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Dropdown } from "react-bootstrap";
import httpMethods from "../../api/Service";
import {
  AddOnResourcePayload,
  AddOnUserResourcePayload,
} from "../../modals/TicketModals";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";

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
  const [sendingAddResourceData, setSendingAddResourceData] =
    useState<AddOnResourcePayload>({
      id: "",
      data: { addOnResource: { name: "", id: "" } },
    });
  const [sendingAddUserData, setSendingAddUserData] =
    useState<AddOnUserResourcePayload>({
      id: "",
      data: { user: { name: "", id: "" }, status: "" },
    });
  const [assignError, setAssignError] = useState<string>("");
  const [assignSuccess, setAssignSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [afterAssigned, setAfterAssigned] = useState({});
  const userContext = useUserContext();
  const { socket, currentUser } = userContext as UserContext;

  const handleSelect = (item: any) => {
    setSelectedUser(item);
    usersData.map((_: { firstName: any; _id: any }, idx: any) => {
      if (_.firstName == item) {
        if (updateref.user.name) {
          setSendingAddResourceData({
            ...sendingAddResourceData,
            data: { addOnResource: { name: _.firstName, id: _._id } },
          });
        } else {
          setSendingAddUserData({
            ...sendingAddUserData,
            data: {
              user: { name: _.firstName, id: _._id },
              status: "Assigned",
            },
          });
        }
      }
    });
  };
  useEffect(() => {
    setSendingAddResourceData({ ...sendingAddResourceData, id: updateref._id });
    setSendingAddUserData({ ...sendingAddUserData, id: updateref._id });
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
      if (updateref.user.name) {
        httpMethods
          .put<AddOnResourcePayload, any>(
            "/tickets/assign-resource",
            sendingAddResourceData,
          )
          .then((result) => {
            setAfterAssigned(result);
            setAssignError("");
            setTimeout(() => {
              setLoading(false);
              setSendingAddResourceData({
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
      } else {
        httpMethods
          .put<AddOnUserResourcePayload, any>(
            "/tickets/update",
            sendingAddUserData,
          )
          .then((result) => {
            setAfterAssigned(result);
            setAssignError("");
            setTimeout(() => {
              setLoading(false);
              socket.emit("assignTicket", {
                id: result._id,
                sender: { id: currentUser._id, name: currentUser.firstName },
              });
              setSendingAddUserData({
                id: "",
                data: { user: { name: "", id: "" }, status: "" },
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
