import React from "react";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import TicketsMain from "./TicketsMain";

function HelpedTickets() {
  const userContext = useUserContext();
  const { currentUser } = userContext as UserContext;
  return (
    <div>
      <TicketsMain url={`/tickets/helped-tickets/${currentUser._id}`} />
    </div>
  );
}

export default HelpedTickets;
