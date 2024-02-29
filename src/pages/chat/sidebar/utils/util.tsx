import React from "react";
import { RectangularSkeleton } from "../../../../utils/shimmer";

export const ChatLoader = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, idx) => (
          <RectangularSkeleton key={idx} />
        ))}
    </>
  );
};
