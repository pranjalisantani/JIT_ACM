import React from "react";

interface HairlineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  subtle?: boolean;
}

export function Hairline({
  orientation = "horizontal",
  className = "",
  subtle = false,
}: HairlineProps) {
  const color = subtle ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.14)";

  if (orientation === "vertical") {
    return (
      <div
        aria-hidden="true"
        className={`w-px h-full shrink-0 ${className}`}
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <hr
      aria-hidden="true"
      className={`w-full border-0 h-px shrink-0 m-0 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
