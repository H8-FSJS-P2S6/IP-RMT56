import React from "react";
export default function button({
  title,
  onClick,
  type,
  className,
  style,
  bgColor,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: bgColor,
        color: "white",
        ...style,
      }}
    >
      {title}
    </button>
  );
}
