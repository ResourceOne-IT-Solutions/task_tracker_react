import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

interface UserData {
  name: string;
  value: number;
}

const PieChartComponent: React.FC = () => {
  // Sample data for the pie chart
  const data: UserData[] = [
    { name: "PendingTickets", value: 40 },
    { name: "AssignedTickets", value: 60 },
    { name: "TotalTickets", value: 100 },
  ];

  const colors = ["#FF6384", "#36A2EB", "#FFCE56"]; // Customize colors

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
