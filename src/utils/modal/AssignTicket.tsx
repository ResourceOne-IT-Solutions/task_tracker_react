import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Dropdown } from "react-bootstrap";
import httpMethods from "../../api/Service";
import {
  AddOnResourcePayload,
  AddOnUserResourcePayload,
  TicketModal,
} from "../../modals/TicketModals";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../modals/UserModals";
import { getFullName } from "../utils";

interface AssignTicketProps {
  updateref: any;
  usersData: UserModal[];
  UpdateTicketsTableData: (updatedticket: TicketModal) => void;
}

function AssignTicket({
  updateref,
  usersData,
  UpdateTicketsTableData,
}: AssignTicketProps) {
  const [selectedUser, setSelectedUser] = useState<string>("");
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

  const handleSelect = (item: any = "") => {
    setSelectedUser(item);
    usersData.map((user) => {

      if (getFullName(user) == item) {
        if (updateref.user.name) {
          setSendingAddResourceData({
            ...sendingAddResourceData,
            data: { addOnResource: { name: getFullName(user), id: user._id } },
          });
        } else {
          setSendingAddUserData({
            ...sendingAddUserData,
            data: {
              user: { name: getFullName(user), id: user._id },
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
          .put<AddOnResourcePayload, TicketModal>(
            "/tickets/assign-resource",
            sendingAddResourceData,
          )
          .then((result) => {
            setAfterAssigned(result);
            setAssignError("");
            const {
              data: { addOnResource },
            } = sendingAddResourceData;
            socket.emit("addResource", {
              ticket: { name: result.client.name, id: result._id },
              user: { name: result.user.name, id: result.user.id },
              resource: { name: addOnResource.name, id: addOnResource.id },
              sender: { name: getFullName(currentUser), id: currentUser._id },
            });
            setTimeout(() => {
              setLoading(false);
              setSendingAddResourceData({
                id: "",
                data: { addOnResource: { name: "", id: "" } },
              });
              setSelectedUser("");
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
          .put<AddOnUserResourcePayload, TicketModal>(
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
                sender: { id: currentUser._id, name: getFullName(currentUser) },
              });
              setSendingAddUserData({
                id: "",
                data: { user: { name: "", id: "" }, status: "" },
              });
              setSelectedUser("");
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
                  ? usersData.map((item: UserModal) => {
                      return (
                        <Dropdown.Item
                          key={item._id}
                          eventKey={getFullName(item)}
                        >
                          {getFullName(item)}
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
