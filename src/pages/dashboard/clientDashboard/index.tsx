import React from "react";
import { useLocation } from "react-router-dom";
import "./index.css";
import Main from "../../tickets/Main";

const ClientDashboard = () => {
  const { state } = useLocation();
  return (
    <>
      <h3>CLIENT DASHBOARD</h3>
      <div className="client-details">
        <p>FirstName : {state.firstName}</p>
        <p>Mobile : {state.mobile}</p>
        <p>Email : {state.email}</p>
        <p>
          Location : {state.location.area}
          {", "}
          {state.location.zone}
        </p>
        <p>Technology : {state.technology}</p>
        <p>TicketsCount : {state.ticketsCount}</p>
        <p>CompanyName : {state.companyName}</p>
        <p>CreatedAt : {state.createdAt}</p>
        <p>UpdatedAt : {state.updatedAt}</p>
      </div>
      <Main url={`/clients/tickets/${state._id}`} />
    </>
  );
};

export default ClientDashboard;
