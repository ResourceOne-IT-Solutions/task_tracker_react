import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell, Label } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  totalTickets: number;
  name?: string;
}

const allColors: any = {
  "NotAssigned Tickets": "#FF6384",
  "Assigned Tickets": "#36A2EB",
  "In Progress Tickets": "#FFCE56",
  "Pending Tickets": "#b80301",
  "Resolved Tickets": "#168f01",
  "Helped Tickets": "#FF6384",
  Available: "#00f02c",
  Offline: "#dc3545",
  Break: "#170ce8",
  "On Ticket": "#0eed9b",
};

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  totalTickets,
  name,
}) => {
  return (
    <div>
      <PieChart
        width={name == "users_statuses" ? 200 : 400}
        height={name == "users_statuses" ? 200 : 400}
        style={{ margin: "auto" }}
      >
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={allColors[_.name]} />
          ))}
          {data.map((entry, index) => (
            <Label
              key={`label-${index}`}
              content={<>{entry.name}</>}
              position="center"
            />
          ))}
        </Pie>
        {name !== "users_statuses" && (
          <>
            <Tooltip />
            <Legend />
          </>
        )}
      </PieChart>
      <h4 style={{ color: "#000000" }}>
        Total {name == "users_statuses" ? "Users" : "Tickets"}: {totalTickets}
      </h4>
    </div>
  );
};

export default PieChartComponent;
