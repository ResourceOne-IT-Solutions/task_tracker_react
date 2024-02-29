import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FILTERS, TICKET_STATUS_TYPES } from "../../utils/Constants";
import { TicketModal } from "../../modals/TicketModals";
import { useNavigate } from "react-router-dom";
import XlSheet from "./XlSheet";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";

interface TicketFilterProps {
  allTickets: TicketModal[];
  setShowingTickets: React.Dispatch<React.SetStateAction<TicketModal[]>>;
}

const TicketFilters = ({
  allTickets,
  setShowingTickets,
}: TicketFilterProps) => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext() as UserContext;
  const [selected, setSelected] = useState<string>("");
  const [filteredData, setFilteredData] = useState<TicketModal[]>(allTickets);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const handleSelectStatus = (item: any) => {
    const date = new Date();
    setSelected(item);
    if (item == "last 1 week") {
      date.setDate(date.getDate() - 7);
      const lastWeekArray = allTickets.filter(
        (item) => new Date(item.receivedDate) >= date,
      );
      setFilteredData(lastWeekArray);
    } else if (item == "last 1 month" || item == "last 2 months") {
      const month = item == "last 1 month" ? 1 : 2;
      date.setMonth(date.getMonth() - month);
      const lastMonthArray = allTickets.filter(
        (item) => new Date(item.receivedDate) >= date,
      );
      setFilteredData(lastMonthArray);
    }
    setDateRange({ from: "", to: "" });
  };
  const handleStatusSelect = (status: any) => {
    const filteredTickets = allTickets.filter(
      (ticket) => ticket.status == status,
    );
    setSelectedStatus(status);
    setFilteredData(filteredTickets);
  };
  const handleDateRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };
  const handleDateRangeSubmit = () => {
    const filtered_data = allTickets.filter((item) => {
      const receivedDate = new Date(item.receivedDate);
      return (
        receivedDate >= new Date(dateRange.from) &&
        receivedDate <= new Date(dateRange.to)
      );
    });
    setFilteredData(filtered_data);
    setSelected("");
  };
  const handleResetFilter = () => {
    setFilteredData(allTickets);
    setSelectedStatus("");
    setSelected("");
    setDateRange({ from: "", to: "" });
  };
  const formattedTicketforXL = (tickets: TicketModal[]) => {
    const formatedData = tickets.map((item, idx) => {
      const resources = item.addOnResource.map((item) => item.name).join(",\n");
      const updates = item.updates.map((item, idx) => {
        const up = `UPDATE ${idx + 1}:\nUpdatedBy : ${
          item.updatedBy.name
        }\nDate: ${new Date(item.date).toLocaleString()},\nDescription : ${
          item.description
        },\nComments : ${item.comments},\nStatus : ${item.status} -----\n\n`;
        return up;
      });
      return {
        "Sl. No": idx + 1,
        "Ticket id": item._id,
        Consultant: item.client.name,
        Owner: item.user.name,
        Technology: item.technology,
        Description: item.description,
        Status: item.status,
        Comments: item.comments,
        "Created Date": new Date(item.receivedDate).toLocaleString(),
        "Closed Date": item.closedDate
          ? new Date(item.closedDate).toLocaleString()
          : "Not Closed",
        "Helped Resources": String(resources),
        Updates: String(updates),
      };
    });
    return formatedData;
  };
  useEffect(() => {
    setShowingTickets(filteredData);
  }, [filteredData]);

  return (
    <div className="filters">
      <div className="d-flex">
        <Button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fa fa-angle-left"></i>
          Back
        </Button>{" "}
        <Dropdown onSelect={handleSelectStatus} className="mx-2">
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic-ticket-filter"
          >
            {selected ? selected : "Select a filter"}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
            {FILTERS.map((filterType, idx) => {
              return (
                <Dropdown.Item key={idx} eventKey={filterType}>
                  <b>{filterType}</b>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={handleStatusSelect} className="mx-2">
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic-ticket-filter"
          >
            {selectedStatus ? selectedStatus : "Select Status"}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
            {Object.values(TICKET_STATUS_TYPES).map((filterType, idx) => {
              return (
                <Dropdown.Item key={idx} eventKey={filterType}>
                  <b>{filterType}</b>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="from-to">
        <label htmlFor="from">From</label>
        <input
          type="date"
          name="from"
          id="from"
          onChange={handleDateRange}
          value={dateRange.from}
          className="form-control"
        />
        <label htmlFor="to">To</label>
        <input
          type="date"
          name="to"
          id="to"
          onChange={handleDateRange}
          value={dateRange.to}
          className="form-control"
        />
      </div>
      <div>
        <button
          className="btn btn-info mx-2"
          onClick={() => handleDateRangeSubmit()}
          disabled={!dateRange.from || !dateRange.to ? true : false}
        >
          GetTickets
        </button>
        <Button onClick={handleResetFilter} className="mx-2">
          Reset Filters
        </Button>
        {currentUser.isAdmin && (
          <XlSheet data={formattedTicketforXL(filteredData)} />
        )}
      </div>
    </div>
  );
};

export default TicketFilters;
