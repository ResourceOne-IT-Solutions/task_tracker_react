import React from "react";
import Tickets from "./TicketsMain";
import { useParams } from "react-router-dom";

function UserTickets() {
  const { id } = useParams();
  const url = `/tickets/user/${id}`;
  return (
    <div>
      <Tickets url={url} />
    </div>
  );
}

export default UserTickets;
