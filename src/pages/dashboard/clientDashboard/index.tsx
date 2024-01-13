import React from "react";
import { useLocation, useParams } from "react-router-dom";

const ClientDashboard = () => {
  const { id } = useParams();
  const { state } = useLocation();
  return (
    <>
      <h3>CLIENT DASHBOARD</h3>
      {JSON.stringify(state, null, 4)}
    </>
  );
};

export default ClientDashboard;
