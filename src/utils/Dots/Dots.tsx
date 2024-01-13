import React from "react";

interface Props {
  title?: string;
  styles?: any;
}

export const GreenDot = ({ title = "", styles = {} }: Props) => {
  return (
    <span
      title={title}
      style={{
        background: "#0f0",
        height: "15px",
        width: "15px",
        display: "inline-block",
        borderRadius: "50%",
        ...styles,
      }}
    ></span>
  );
};

export const RedDot = ({ title, styles }: Props) => {
  return (
    <span
      title={title}
      style={{
        background: "#f00",
        height: "15px",
        width: "15px",
        display: "inline-block",
        borderRadius: "50%",
        ...styles,
      }}
    ></span>
  );
};
export const OrangeDot = ({ title, styles }: Props) => {
  return (
    <span
      title={title}
      style={{
        background: "orange",
        height: "15px",
        width: "15px",
        display: "inline-block",
        borderRadius: "50%",
        ...styles,
      }}
    ></span>
  );
};
