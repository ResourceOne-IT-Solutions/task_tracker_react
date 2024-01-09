import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ data, colors }) => {
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
