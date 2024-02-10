import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";
import httpMethods from "../../../api/Service";
import { TicketModal } from "../../../modals/TicketModals";
import PieChartComponent from "../../../components/pieChart/PieChart";
import Tickets from "../../tickets";

const ClientDashboard = () => {
  const { state } = useLocation();
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
      <h3>CLIENT DASHBOARD</h3>

      <div className="client-details">
        <div className="sub-details">
          <p>FirstName : {clientState.firstName}</p>
          <p>Mobile : {clientState.mobile}</p>
          <p>Email : {clientState.email}</p>
          <p>
            Location : {clientState.location.area}
            {", "}
            {clientState.location.zone}
          </p>
          <p>Technology : {clientState.technology}</p>
          <p>TicketsCount : {clientState.ticketsCount}</p>
          <p>CompanyName : {clientState.companyName}</p>
          <p>CreatedAt : {clientState.createdAt}</p>
          <p>UpdatedAt : {clientState.updatedAt}</p>
        </div>
        <div className="pie-chart-main">
          <PieChartComponent
            data={pieChartData}
            totalTickets={selectedTickets.length}
          />
        </div>
      </div>

      {/* <TicketsMain url={`/clients/tickets/${clientState._id}`} /> */}
      <Tickets url={`/tickets/client/${clientState._id}`} />
    </>
  );
};

export default ClientDashboard;
