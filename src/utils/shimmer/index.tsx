import React, { CSSProperties } from "react";
import "./index.css";

interface RectangularSkeletonProps {
  styles?: CSSProperties;
  count?: number;
}

export const RectangularSkeleton = ({
  styles = {},
  count = 1,
}: RectangularSkeletonProps) => {
  return (
    <>
      {Array(count)
        .fill(1)
        .map((_, idx) => (
          <div key={idx} className="skeleton-rect" style={styles}></div>
        ))}
    </>
  );
};
