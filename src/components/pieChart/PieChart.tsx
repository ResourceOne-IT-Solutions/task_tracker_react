import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell, Label } from "recharts";
import { USER_STATUSES } from "../../utils/Constants";

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
  "Closed Tickets": "#168f01",
  "Helped Tickets": "#FF6384",
  Available: "#00f02c",
  Offline: "#dc3545",
  Break: "#ffa500",
  "On Ticket": "#0075ff",
};

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  totalTickets,
  name,
}) => {
  return (
    <div className="text-center">
      {totalTickets ? (
        <PieChart
          width={name == USER_STATUSES ? 200 : 400}
          height={name == USER_STATUSES ? 200 : 400}
          style={{ margin: "auto" }}
        >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={name == USER_STATUSES ? 80 : 90}
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
          {name !== USER_STATUSES && (
            <>
              <Legend />
            </>
          )}
        </PieChart>
      ) : (
        <h4>No {name == USER_STATUSES ? "Users" : "Tickets"} Data</h4>
      )}
      <h4 style={{ color: "#000000" }}>
        Total {name == USER_STATUSES ? "Users" : "Tickets"}: {totalTickets}
      </h4>
    </div>
  );
};

export default PieChartComponent;
