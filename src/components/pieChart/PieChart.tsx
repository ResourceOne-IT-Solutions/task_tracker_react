import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  totalTickets: number;
}
const mainColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#878787",
  "#FCFCFC",
  "#8656FF",
];

const PieChartComponent: React.FC<PieChartProps> = ({ data, totalTickets }) => {
  const colors = mainColors.slice(0, data.length);
  return (
    <>
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
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <h4 style={{ color: colors[1] }}>Total Tickets: {totalTickets}</h4>
    </>
  );
};

export default PieChartComponent;
