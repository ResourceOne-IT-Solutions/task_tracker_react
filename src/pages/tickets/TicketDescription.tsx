import React from "react";
import { useLocation } from "react-router-dom";

const TicketDescription = () => {
  const { state } = useLocation();
  return (
    <>
      <h3>TICKETS BY ID</h3>
      <pre>{JSON.stringify(state, null, 4)}</pre>
    </>
  );
};

export default TicketDescription;
