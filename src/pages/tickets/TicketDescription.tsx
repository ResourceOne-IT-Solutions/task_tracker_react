import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./TicketDescription.css";
import {
  SendTicketEmail,
  TicketUpdateMessage,
  TicketModal,
  TicketUpdates,
} from "../../modals/TicketModals";
import ReusableModal from "../../utils/modal/ReusableModal";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { NameIdInterface, UserContext } from "../../modals/UserModals";
import httpMethods from "../../api/Service";
import XlSheet from "./XlSheet";
import { ErrorMessageInterface } from "../../modals/interfaces";
import { CLOSED } from "../../utils/Constants";

const updateContent = (updates: TicketUpdates[]) => {
  let str = "";
  updates.forEach((update, i) => {
    const content = `Update ${i + 1}:,\nDate: ${new Date(
      update.date,
    ).toLocaleString()},\nDescription: ${update.description},\nComments: ${
      update.comments
    },\nStatus: ${update.status},\nUpdated by: ${update.updatedBy.name}`;
    str += content + "\n";
  });
  return str;
};
const mailContent = (ticket: TicketModal) => {
  return `Consultant Name: ${ticket.client.name},\nTicket Owner: ${
    ticket.user.name
  },\nRequirement: ${ticket.requirement},\nFinal Status: ${
    ticket.status
  },\nTotal Updates:\n${updateContent(ticket.updates)},`;
};

const TicketDescription = () => {
  const { state } = useLocation();
  const userContext = useUserContext();
  const { currentUser } = userContext as UserContext;
  const [selectedTicket, setSelectedTicket] = useState<TicketModal>(state);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    status: "",
    message: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [resource, setResource] = useState("");
  const [mailPayload, setMailPayload] = useState({
    to: currentUser.email,
    content: "",
  });
  const navigate = useNavigate();
  const sendTicketUpdate = () => {
    setIsLoading(true);
    const payload = {
      ...mailPayload,
      updateType: "TICKET",
      content: selectedTicket,
    };
    httpMethods
      .post<SendTicketEmail, TicketUpdateMessage>(
        "/mail/ticket-update",
        payload,
      )
      .then(() => {
        setResponseMessage({
          status: "SUCCESS",
          message: "Email Sent Successfully",
        });
      })
      .catch((er: ErrorMessageInterface) => {
        setResponseMessage({
          status: "ERROR",
          message: er.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const convertTicketToExcel = (ticket: TicketModal) => {
    const format = {
      "Consultant Name": ticket.client.name,
      "Owner Name:": ticket.user.name,
      "Created Date": new Date(ticket.receivedDate).toLocaleString(),
      "Final Status": ticket.status,
      Updates: updateContent(ticket.updates),
    };
    return [format];
  };
  const handleModalClose = () => {
    setShowModal(false);
    setResponseMessage({ status: "", message: "" });
  };

  useEffect(() => {
    let x = "";
    selectedTicket.addOnResource?.forEach((item: NameIdInterface) => {
      x += item.name + ", ";
    });
    setResource(x);
  }, []);
  return (
    <div className="container">
      <div className="ticketsById">
        <div>
          <Button
            className="mx-2 back-btn"
            variant="warning"
            onClick={() => navigate(-1)}
          >
            <i className="fa fa-angle-left"></i>
            Go Back
          </Button>
        </div>
        <h3 className="text-center">Ticket Description</h3>
        {currentUser.isAdmin && (
          <div className="text-center">
            <Button className="mx-2" onClick={() => setShowModal(!showModal)}>
              Send Email
            </Button>
            <XlSheet data={convertTicketToExcel(selectedTicket)} />
          </div>
        )}
      </div>
      <div className="ticket-details d-flex w-100">
        <div className="">
          <p className="m-2">
            <b>Client Name : </b> {selectedTicket.client.name}
          </p>
          <p className="m-2">
            <b>Owner Name :</b> {selectedTicket.user.name}
          </p>
          <p className="m-2">
            <b>Technology :</b> {selectedTicket.technology}
          </p>
          <p className="m-2">
            <b>Status :</b> {selectedTicket.status}
          </p>
          <p className="m-2">
            <b>Created By :</b> {selectedTicket.createdBy.name}
          </p>
          {(selectedTicket.isClosed || selectedTicket.status == CLOSED) && (
            <p className="m-2">
              <b>Closed By :</b> {selectedTicket?.closedBy?.name}
            </p>
          )}
          <p className="m-2">
            <b>Requirement :</b> {selectedTicket.requirement}
          </p>
          <p className="m-2">
            <b>Final Description :</b> {selectedTicket.description}
          </p>
          <p className="m-2">
            <b>Comments :</b> {selectedTicket.comments}
          </p>
          <p className="m-2">
            <b>ReceivedDate :</b>{" "}
            {new Date(selectedTicket.receivedDate).toLocaleString()}
          </p>
          <p className="m-2">
            <span className="fw-bold">Last Update :</span>
            {new Date(selectedTicket.updatedAt).toLocaleString()}
          </p>
          {resource && (
            <p className="m-2">
              <b>addOnResource :</b> {resource}
            </p>
          )}
          <p className="fw-bold m-2">Total Updates:</p>
          <ul className="all-desc m-2">
            {selectedTicket.updates.map((item, index) => {
              return (
                <li key={item._id}>
                  <div className="fw-bold">Update {index + 1}: </div>
                  <div>Date: {new Date(item.date).toLocaleString()}</div>
                  <div>Description: {item.description}</div>
                  <div>Comments: {item.comments}</div>
                  <div>Status: {item.status}</div>
                  <div>Updated by : {item.updatedBy.name}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {showModal && (
        <ReusableModal
          vals={{ setShowModal, show: showModal, title: "Send email:" }}
        >
          <div>
            <div>
              <input
                className="form-control"
                type="email"
                value={mailPayload.to}
                onChange={(e) =>
                  setMailPayload((pre) => ({ ...pre, to: e.target.value }))
                }
              />
            </div>
            <div>
              <textarea
                readOnly
                rows={5}
                className="form-control"
                defaultValue={mailContent(selectedTicket)}
              ></textarea>
            </div>
            <div
              className={`fw-bold ${
                responseMessage.status === "SUCCESS"
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {responseMessage.message}
            </div>
            <div className="d-flex justify-content-end gap-3 pt-2">
              <Button onClick={sendTicketUpdate} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
              <Button variant="danger" onClick={handleModalClose}>
                Cancel
              </Button>
            </div>
          </div>
        </ReusableModal>
      )}
    </div>
  );
};

export default TicketDescription;
