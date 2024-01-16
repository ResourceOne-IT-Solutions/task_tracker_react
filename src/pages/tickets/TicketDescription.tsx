import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./TicketDescription.css";
const TicketDescription = () => {
  const { state } = useLocation();
  const [resource, setResource] = useState("");

  useEffect(() => {
    let x = "";
    state.addOnResource?.forEach((item: any) => {
      x += item.name + ", ";
    });
    setResource(x);
  }, []);
  return (
    <>
      <h3>TICKETS BY ID</h3>
      <div className="ticket-details">
        <p>
          <b>Client Name : </b> {state.client.name}
        </p>
        <p>
          <b>User Name :</b> {state.user.name}
        </p>
        <p>
          <b>Technology :</b> {state.technology}
        </p>
        <p>
          <b>Status :</b> {state.status}
        </p>
        <p>
          <b>Description :</b> {state.description}
        </p>
        <p>
          <b>Comments :</b> {state.comments}
        </p>
        <p>
          <b>ReceivedDate :</b> {state.receivedDate}
        </p>
        {resource && (
          <p>
            <b>addOnResource :</b> {resource}
          </p>
        )}

        <ul className="all-desc">
          {state.updates?.map((item: any, index: number) => {
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
