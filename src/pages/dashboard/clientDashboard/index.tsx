import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";
import httpMethods from "../../../api/Service";
import { TicketModal } from "../../../modals/TicketModals";
import TaskTable, { TableHeaders } from "../../../utils/table/Table";
import TicketsMain from "../../tickets/TicketsMain";
import PieChartComponent from "../../../components/pieChart/PieChart";

const ClientDashboard = () => {
  const { state } = useLocation();
  const [selectedTickets, setSelectedTickets] = useState<TicketModal[]>([]);
  const [pieChartData, setPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Resolved Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);
  useEffect(() => {
    httpMethods
      .get<TicketModal[]>(`/clients/tickets/${state._id}`)
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
          (ticket) => ticket.status === "Resolved",
        ).length;
        const improperTickets = tickets.filter(
          (ticket) => ticket.status === "Improper Requirment",
        ).length;

        setPieChartData([
          { name: "NotAssigned Tickets", value: notAssignedTickets },
          { name: "Assigned Tickets", value: assignedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Pending Tickets", value: pendingTickets },
          { name: "Resolved Tickets", value: resolvedTickets },
          { name: "Improper Requirment", value: improperTickets },
        ]);
      });
  }, []);
  return (
    <>
      <h3>CLIENT DASHBOARD</h3>

      <div className="client-details">
        <div className="sub-details">
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
        <div className="pie-chart-main">
          <PieChartComponent
            data={pieChartData}
            totalTickets={selectedTickets.length}
          />
        </div>
      </div>

      <TicketsMain url={`/clients/tickets/${state._id}`} />
    </>
  );
};

export default ClientDashboard;
