import React, { useState } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import { getDate } from "../utils";
interface ShowModalpopup {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function MessageAllUsersModal({ setShowModal }: ShowModalpopup) {
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, socket } = userContext as UserContext;
  const [message, setMessage] = useState<string>("");
  const [msgError, setmsgError] = useState<string>("");
  const [msgSuccess, setmsgSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleSend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (message) {
      setmsgError("");
      socket.emit("adminMessage", {
        sender: { id: currentUser._id, name: currentUser.firstName },
        content: message,
        time: getDate(),
        date: getDate(),
      });
      setmsgSuccess(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
      setMessage("");
    } else {
      setmsgSuccess(false);
      setmsgError("Please Enter the Message");
    }
  };
  return (
    <div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              as={"textarea"}
              placeholder="Enter Message"
              name="address"
              rows={2}
              onChange={handleChange}
              value={message}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleSend(e)}
            >
              Send Message
            </Button>{" "}
          </Form.Group>
        </Row>
        {msgSuccess ? (
          <div className="scc-msg">Message Sent Successfully</div>
        ) : null}
        {msgError && <div className="err-msg">{msgError}</div>}
      </Form>
    </div>
  );
}

export default MessageAllUsersModal;
