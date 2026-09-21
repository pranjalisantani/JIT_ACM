import React from "react";

interface DiamondProps {
  size?: number; // 6 to 8px
  filled?: boolean;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

export function Diamond({
  size = 6,
  filled = true,
  className = "",
  "aria-hidden": ariaHidden = true,
}: DiamondProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={`inline-block shrink-0 rotate-45 transition-colors ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: filled ? "#ffffff" : "transparent",
        border: filled ? "none" : "1px solid rgba(255, 255, 255, 0.7)",
      }}
    />
  );
}
