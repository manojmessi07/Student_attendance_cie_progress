import React, { useEffect, useState } from "react";
import "./gauge.css";

export default function PerformanceGauge({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [rotation, setRotation] = useState(0);

  // animate value increasing from 0 → actual
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const step = 10;

    const increment = (end - start) / (duration / step);

    const anim = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(anim);
      }
      setDisplayValue(Math.floor(start));
      setRotation((start / 100) * 180);
    }, step);

    return () => clearInterval(anim);
  }, [value]);

  return (
    <div className="gauge-container">
      <div className="gauge-wrapper">

        {/* Colored semi-circle background */}
        <div className="gauge-arc"></div>

        {/* Needle */}
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${rotation - 90}deg)` }} 
        ></div>

        {/* Center cap */}
        <div className="gauge-center"></div>

        {/* Tick Labels */}
        <div className="gauge-label gauge-label-0">0</div>
        <div className="gauge-label gauge-label-50">50</div>
        <div className="gauge-label gauge-label-100">100</div>
      </div>

      <p className="gauge-value">{displayValue}%</p>
    </div>
  );
}
