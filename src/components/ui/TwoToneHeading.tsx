import React from "react";

interface TwoToneHeadingProps {
  line1: string;
  line2?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export function TwoToneHeading({
  line1,
  line2,
  as: Component = "h2",
  className = "",
}: TwoToneHeadingProps) {
  return (
    <Component
      className={`font-light tracking-tight leading-[1.08] text-white ${className}`}
      style={{ fontWeight: 300 }}
    >
      <span className="block text-white">{line1}</span>
      {line2 && (
        <span className="block" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          {line2}
        </span>
      )}
    </Component>
  );
}
