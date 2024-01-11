import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  colors: string[];
  totalTickets: number;
}

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  colors,
  totalTickets,
}) => {
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
