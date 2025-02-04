"use client"

import React, { useEffect, useState } from "react";

const CheckAnimation = () => {
  const [strokeDashoffset, setStrokeDashoffset] = useState(16);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setStrokeDashoffset(0);
    }, 100);

    return () => clearTimeout(animationTimer);
  }, []);

  const containerStyle = {
    display: "inline-block",
    position: "relative",
    width: "18px",
    height: "18px",
    borderRadius: "3px",
    background: "#ffffff",
    transform: "scale(1)",
    verticalAlign: "middle",
    animation: "wave 0.4s ease",
  };

  const svgStyle = {
    position: "absolute",
    top: "2px",
    left: "2px",
    fill: "none",
    stroke: "#36bd2e",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: "16px",
    strokeDashoffset: strokeDashoffset,
    transition: "stroke-dashoffset 0.3s ease 0.1s",
  };

  return (
      <div style={containerStyle}>
        <svg viewBox="0 0 12 10" height="17px" width="17px" style={svgStyle}>
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </div>
  );
};

export default CheckAnimation;