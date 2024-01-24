import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { TicketModal } from "../../modals/TicketModals";
import httpMethods from "../../api/Service";

interface EmailInterface {
  to: string | undefined;
  content: string;
}
function MailSender({ updateReference }: any) {
  const [selectedTicket, setSelectedTicket] =
    useState<TicketModal>(updateReference);
  const [emailData, setEmailData] = useState<EmailInterface>({
    to: selectedTicket.client.email,
    content: `Task Update:\n${selectedTicket.client.name},\n\n${selectedTicket.description}\n\nRegards,\nSupport Team.`,
  });
  const [sending, setSending] = useState<boolean>(false);
  const [sccMsg, setSccMsg] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailData({ ...emailData, content: event.target.value });
  };
  const handleSendEmail = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const data = { ...emailData, content: `<pre>${emailData.content}</pre>` };
    setSending(true);
    httpMethods
      .post<any, any>("/mail/client-update", data)
      .then((dt: any) => {
        setSccMsg(dt.message);
        setSending(false);
      })
      .catch((err) => {
        setSending(false);
      });
  };
  return (
    <div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="to"
              value={emailData.to}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              as={"textarea"}
              placeholder="Enter Message"
              name="content"
              rows={4}
              onChange={handleChange}
              value={emailData.content}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button variant="primary" type="submit" onClick={handleSendEmail}>
              {sending ? "Sending..." : "Send Mail"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {sccMsg && <div className="scc-msg">{sccMsg}</div>}
      </Form>
    </div>
  );
}

export default MailSender;
