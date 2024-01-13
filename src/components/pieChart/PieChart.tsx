import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell, Label } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  totalTickets: number;
}

const allColors: any = {
  "NotAssigned Tickets": "#FF6384",
  "Assigned Tickets": "#36A2EB",
  "In Progress Tickets": "#FFCE56",
  "Pending Tickets": "#b80301",
  "Resolved Tickets": "#168f01",
  "Helped Tickets": "#FF6384",
};

const PieChartComponent: React.FC<PieChartProps> = ({ data, totalTickets }) => {
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
        <Tooltip />
        <Legend />
      </PieChart>
      <h4 style={{ color: "#000000" }}>Total Tickets: {totalTickets}</h4>
    </div>
  );
};

export default PieChartComponent;
