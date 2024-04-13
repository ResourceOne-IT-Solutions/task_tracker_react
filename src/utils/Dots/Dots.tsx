import React, { CSSProperties } from "react";

export enum DotColors {
  ORANGE = "orange",
  GREEN = "#0f0",
  RED = "#f00",
  BLUE = "blue",
  GREY = "grey",
}

export interface DotProps {
  title?: string;
  styles?: CSSProperties;
  color: DotColors;
}

export const Dot = ({ title = "", styles = {}, color }: DotProps) => {
  return (
    <span
      title={title}
      style={{
        background: color,
        height: "15px",
        width: "15px",
        display: "inline-block",
        borderRadius: "50%",
        ...styles,
      }}
    ></span>
  );
};
