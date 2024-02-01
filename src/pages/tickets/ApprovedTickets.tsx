import React from "react";
import { useLocation } from "react-router-dom";
import TicketsMain from "./TicketsMain";

function ApprovedTickets() {
  const ticketData = useLocation().state;
  return (
    <div>
      <TicketsMain url={`/clients/tickets/${ticketData.client.id}`} />
    </div>
  );
}

export default ApprovedTickets;
