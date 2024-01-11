import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  totalTickets: number;
}

const PieChartComponent: React.FC<PieChartProps> = ({ data, totalTickets }) => {
  const colorHandling = (name: string) => {
    if (name == "NotAssigned Tickets") {
      return "#FF6384";
    } else if (name == "Assigned Tickets") {
      return "#36A2EB";
    } else if (name == "In Progress Tickets") {
      return "#FFCE56";
    } else if (name == "Pending Tickets") {
      return "#b80301";
    } else if (name == "Resolved Tickets") {
      return "#168f01";
    } else if (name == "Helped Tickets") {
      return "#FF6384";
    }
    return "";
  };
  return (
    <div>
      <PieChart width={400} height={400} style={{ margin: "auto" }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colorHandling(_.name)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <h4 style={{ color: "#000000" }}>Total Tickets: {totalTickets}</h4>
    </div>
  );
};

export default PieChartComponent;
