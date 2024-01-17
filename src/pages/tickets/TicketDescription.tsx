import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./TicketDescription.css";
import { TicketModal } from "../../modals/TicketModals";
const TicketDescription = () => {
  const { state } = useLocation();
  const [selectedTicket, setSelectedTicket] = useState<TicketModal>(state);
  const [resource, setResource] = useState("");

  useEffect(() => {
    let x = "";
    selectedTicket.addOnResource?.forEach((item: any) => {
      x += item.name + ", ";
    });
    setResource(x);
  }, []);
  return (
    <>
      <h3>TICKETS BY ID</h3>
      <div className="ticket-details">
        <p>
          <b>Client Name : </b> {selectedTicket.client.name}
        </p>
        <p>
          <b>User Name :</b> {selectedTicket.user.name}
        </p>
        <p>
          <b>Technology :</b> {selectedTicket.technology}
        </p>
        <p>
          <b>Status :</b> {selectedTicket.status}
        </p>
        <p>
          <b>Description :</b> {selectedTicket.description}
        </p>
        <p>
          <b>Comments :</b> {selectedTicket.comments}
        </p>
        <p>
          <b>ReceivedDate :</b>{" "}
          {selectedTicket.receivedDate as unknown as string}
        </p>
        {resource && (
          <p>
            <b>addOnResource :</b> {resource}
          </p>
        )}

        <ul className="all-desc">
          {selectedTicket.updates?.map((item: any, index: number) => {
            return (
              <li key={index}>
                <p>Date: {item.date}</p>
                <p>Description: {item.description}</p>
                <p>Comments: {item.comments}</p>
                <p>Status: {item.status}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default TicketDescription;
