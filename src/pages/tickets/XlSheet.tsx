import React from "react";
import { Button } from "react-bootstrap";
import { TicketModal } from "../../modals/TicketModals";
import * as XLSX from "xlsx";
interface Prop {
  tableData: TicketModal[];
}
function XlSheet({ tableData }: Prop) {
  const formatedData = tableData.map((item) => {
    const resources = item.addOnResource.map((item) => item.name);
    const updates = item.updates.map((item, idx) => {
      const up = `UPDATE ${idx + 1}: UpdatedBy : ${
        item.updatedBy ? item.updatedBy.name : null
      }, Description : ${item.description}, Comments : ${
        item.comments
      }, Status : ${item.status} -----`;
      return up;
    });
    return {
      client: item.client.name,
      user: item.user.name,
      _id: item._id,
      technology: item.technology,
      description: item.description,
      status: item.status,
      comments: item.comments,
      assignedDate: item.assignedDate,
      closedDate: item.closedDate,
      addOnResource: String(resources),
      updates: String(updates),
    };
  });
  const handleExportClick = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formatedData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "AllTickets.xlsx");
  };
  return (
    <>
      <Button onClick={handleExportClick}>Xl Sheet</Button>
    </>
  );
}

export default XlSheet;
