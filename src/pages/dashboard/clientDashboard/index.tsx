import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import httpMethods from "../../../api/Service";
import { TicketModal } from "../../../modals/TicketModals";
import PieChartComponent from "../../../components/pieChart/PieChart";
import Tickets from "../../tickets";
import { Button } from "react-bootstrap";
import { ClientModal } from "../../../modals/ClientModals";

const ClientDashboard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [clientState, setClientState] = useState(state);
  const [selectedTickets, setSelectedTickets] = useState<TicketModal[]>([]);
  const [pieChartData, setPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Closed Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);
  useEffect(() => {
    httpMethods
      .get<TicketModal[]>(`/tickets/client/${clientState._id}`)
      .then((tickets) => {
        setSelectedTickets(tickets);
        const notAssignedTickets = tickets.filter(
          (ticket) => ticket.status === "Not Assigned",
        ).length;
        const assignedTickets = tickets.filter(
          (ticket) => ticket.status === "Assigned",
        ).length;
        const progressTickets = tickets.filter(
          (ticket) => ticket.status === "In Progress",
        ).length;
        const pendingTickets = tickets.filter(
          (ticket) => ticket.status === "Pending",
        ).length;
        const resolvedTickets = tickets.filter(
          (ticket) => ticket.status === "Closed",
        ).length;
        const improperTickets = tickets.filter(
          (ticket) => ticket.status === "Improper Requirment",
        ).length;

        setPieChartData([
          { name: "NotAssigned Tickets", value: notAssignedTickets },
          { name: "Assigned Tickets", value: assignedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Pending Tickets", value: pendingTickets },
          { name: "Closed Tickets", value: resolvedTickets },
          { name: "Improper Requirment", value: improperTickets },
        ]);
      });
  }, []);
  useEffect(() => {
    setClientState(state);
  }, [state]);
  return (
    <>
      <h3 className="text-center">CLIENT DASHBOARD</h3>
      <div className="client-details">
        <div className="sub-details px-1">
          <ClientCard client={clientState} />
        </div>
        <div className="pie-chart-main">
          <PieChartComponent
            data={pieChartData}
            totalTickets={selectedTickets.length}
          />
        </div>
        {/* <Button variant="warning" onClick={() => navigate(-1)}>
          Go Back
        </Button> */}
      </div>

      {/* <TicketsMain url={`/clients/tickets/${clientState._id}`} /> */}
      <Tickets url={`/tickets/client/${clientState._id}`} />
    </>
  );
};

export default ClientDashboard;

export const ClientCard = ({ client }: { client: ClientModal }) => {
  return (
    <>
      <p>FirstName : {client.firstName}</p>
      <p>Mobile : {client.mobile}</p>
      <p>Email : {client.email}</p>
      <p>
        Location : {client.location.area}
        {", "}
        {client.location.zone}
      </p>
      <p>Technology : {client.technology}</p>
      <p>TicketsCount : {client.ticketsCount}</p>
      <p>CompanyName : {client.companyName}</p>
      <p>CreatedAt : {client.createdAt}</p>
      <p>UpdatedAt : {client.updatedAt}</p>
    </>
  );
};
