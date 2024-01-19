import React, { useState } from "react";
import { UserContext, UserModal } from "../../modals/UserModals";
import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import { getFullName } from "../utils";
import { useUserContext } from "../../components/Authcontext/AuthContext";

function TicketRaiseModal(props: { adminsData: UserModal[] }) {
  const userContext = useUserContext();
  const { socket, currentUser } = userContext as UserContext;
  const [onlyAdmins, setOnlyAdmins] = useState<UserModal[]>(props.adminsData);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [RaiseError, setRaiseError] = useState<string>("");
  const [RaiseSuccess, setRaiseSuccess] = useState<boolean>(false);

  const handleSelect = (name: any) => {
    setSelectedItem(name);
  };
  const handleTicketRaise = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (selectedItem) {
      setRaiseError("");
      setLoading(true);
      let exactAdminid = "";
      let exactAdminname = "";
      onlyAdmins.forEach((item: UserModal) => {
        if (item.firstName == selectedItem) {
          exactAdminid = item._id;
          exactAdminname = item.firstName;
        }
      });
      socket.emit("requestChat", {
        user: { name: getFullName(currentUser), id: currentUser._id },
        opponent: { name: exactAdminname, id: exactAdminid },
      });
      setLoading(false);
    } else {
      setRaiseSuccess(false);
      setRaiseError("Please Select an Admin");
    }
  };
  return (
    <>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedItem ? selectedItem : "Select an Admin"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {onlyAdmins !== null
                  ? onlyAdmins.map((item: UserModal, index: any) => {
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
              onClick={(e) => handleTicketRaise(e)}
            >
              {loading ? "Sending..." : "Raise Ticket"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {RaiseSuccess ? (
          <div className="scc-msg">Ticket Raised Successfully</div>
        ) : null}
        {RaiseError && <div className="err-msg">{RaiseError}</div>}
      </Form>
    </>
  );
}

export default TicketRaiseModal;
