import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FILTERS, TICKET_STATUS_TYPES } from "../../utils/Constants";
import { TicketModal } from "../../modals/TicketModals";

interface TicketFilterProps {
  allTickets: TicketModal[];
  setShowingTickets: React.Dispatch<React.SetStateAction<TicketModal[]>>;
}

const TicketFilters = ({
  allTickets,
  setShowingTickets,
}: TicketFilterProps) => {
  const [selected, setSelected] = useState<string>("");
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
      setShowingTickets(lastWeekArray);
    } else if (item == "last 1 month" || item == "last 2 months") {
      const month = item == "last 1 month" ? 1 : 2;
      date.setMonth(date.getMonth() - month);
      const lastMonthArray = allTickets.filter(
        (item) => new Date(item.receivedDate) >= date,
      );
      setShowingTickets(lastMonthArray);
    }
    setDateRange({ from: "", to: "" });
  };
  const handleStatusSelect = (status: any) => {
    const filteredTickets = allTickets.filter(
      (ticket) => ticket.status == status,
    );
    setSelectedStatus(status);
    setShowingTickets(filteredTickets);
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
    setShowingTickets(filtered_data);
    setSelected("");
  };
  const handleResetFilter = () => {
    setShowingTickets(allTickets);
    setSelectedStatus("");
    setSelected("");
    setDateRange({ from: "", to: "" });
  };

  return (
    <div className="filters">
      <Dropdown onSelect={handleSelectStatus} className="drop-down">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic-ticket-filter">
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
      <Dropdown onSelect={handleStatusSelect} className="drop-down">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic-ticket-filter">
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
        <button
          className="btn btn-info"
          onClick={() => handleDateRangeSubmit()}
          disabled={!dateRange.from || !dateRange.to ? true : false}
        >
          GetTickets
        </button>
      </div>
      <Button onClick={handleResetFilter}>Reset Filters</Button>
    </div>
  );
};

export default TicketFilters;
