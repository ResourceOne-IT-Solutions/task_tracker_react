import React, { useState } from "react";
import { UserContext, UserModal } from "../../modals/UserModals";
import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import { getFullName } from "../utils";
import { useUserContext } from "../../components/Authcontext/AuthContext";

function TicketRaiseModal(props: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userContext = useUserContext();
  const { socket, currentUser } = userContext as UserContext;
  const [content, setContent] = useState("");
  const [RaiseError, setRaiseError] = useState<string>("");
  const [RaiseSuccess, setRaiseSuccess] = useState<boolean>(false);

  const handleChangemessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };
  const handleTicketRaise = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (content) {
      setRaiseError("");
      socket.emit("raiseTicket", {
        sender: { name: getFullName(currentUser), id: currentUser._id },
        content: content,
      });
      setContent("");
      setRaiseSuccess(true);
      setTimeout(() => {
        props.setShowModal(false);
      }, 300);
    } else {
      setRaiseSuccess(false);
      setRaiseError("Please Enter Message");
    }
  };
  return (
    <>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              as={"textarea"}
              placeholder="Enter Requested Message"
              name="address"
              rows={2}
              onChange={handleChangemessage}
              value={content}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleTicketRaise(e)}
            >
              Raise Ticket
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
