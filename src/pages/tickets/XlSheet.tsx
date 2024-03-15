import React from "react";
import { Button } from "react-bootstrap";
import { TicketModal } from "../../modals/TicketModals";
import * as XLSX from "xlsx";
interface Prop {
  data: any[];
}
function XlSheet({ data }: Prop) {
  const handleExportClick = () => {
    const download_or_not = window.confirm(
      "Are you sure want to download Excel",
    );
    if (download_or_not) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      const headerCellStyle = { font: { bold: true } };
      Object.keys(ws).forEach((key) => {
        if (key.includes("1")) {
          // Assuming header starts from column A
          const cell = ws[key];
          if (cell && cell.s) {
            ws[key].s = headerCellStyle;
          }
        }
      });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "AllTickets.xlsx");
    }
  };
  return (
    <>
      <Button onClick={handleExportClick} disabled={data.length ? false : true}>
        Convert to Excel
      </Button>
    </>
  );
}

export default XlSheet;
