import React, { useEffect, useRef } from "react";

interface PieChartProps {
  data: {
    totalTickets: number;
    resolved: number;
    pending: number;
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalTicketsData = [data.totalTickets, data.resolved, data.pending];
  const labels = ["Total", "Resolved", "Pending"];
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const total = totalTicketsData.reduce((acc, value) => acc + value, 0);
    let startAngle = 0;

    const colors = ["#FFFF00", "#00FF00", "#FF0000"]; // Yellow, Green ,Red

    totalTicketsData.forEach((value, index) => {
      const sliceAngle = (value / total) * (2 * Math.PI);

      // Draw the pie segment
      ctx.beginPath();
      ctx.fillStyle = colors[index];
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 3,
        startAngle,
        startAngle + sliceAngle,
      );
      ctx.closePath();
      ctx.fill();

      // Draw text in the center of each segment
      const textX =
        canvas.width / 2 +
        (canvas.width / 3 / 2) * Math.cos(startAngle + sliceAngle / 2);
      const textY =
        canvas.height / 2 +
        (canvas.width / 3 / 2) * Math.sin(startAngle + sliceAngle / 2);

      ctx.fillStyle = "#000000"; // Set text color
      ctx.font = "12px Arial"; // Set font size and type
      ctx.textAlign = "center";
      ctx.fillText(`${value} ${labels[index]}`, textX, textY);

      startAngle += sliceAngle;
    });
  }, [data]);

  return <canvas ref={canvasRef} width={350} height={350}></canvas>;
};

export default PieChart;
