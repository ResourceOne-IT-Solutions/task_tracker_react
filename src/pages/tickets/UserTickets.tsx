import React from "react";
import Tickets from "./TicketsMain";
import { useParams } from "react-router-dom";

function UserTickets() {
  const { id } = useParams();
  const url = `/users/tickets/${id}`;
  return (
    <div>
      <Tickets url={url} />
    </div>
  );
}

export default UserTickets;
