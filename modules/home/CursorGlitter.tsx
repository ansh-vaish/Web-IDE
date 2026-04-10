"use client";
import { useEffect, useState, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export  function CursorGlitter() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        angleRef.current += 0.3;
        const radius = 15;
        const offsetX = Math.cos(angleRef.current) * radius;
        const offsetY = Math.sin(angleRef.current) * radius;

        setTrail((prev) => {
          const newTrail = [
            ...prev,
            {
              x: e.clientX + offsetX,
              y: e.clientY + offsetY,
              timestamp: Date.now(),
            },
          ];

          // Keep only recent points
          return newTrail.filter((point) => Date.now() - point.timestamp < 300);
        });

        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const animate = () => {
      setTrail((prev) =>
        prev.filter((point) => Date.now() - point.timestamp < 300),
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="w-full h-full">
        {trail.length > 1 && (
          <path
            d={`M ${trail.map((point, i) => `${point.x},${point.y}`).join(" L ")}`}
            fill="none"
            stroke="url(#curlyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
          />
        )}
        <defs>
          <linearGradient id="curlyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
          </linearGradient>
        </defs>
      </svg>
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const opacity = Math.max(0, 1 - age / 300);
        const scale = 1 - age / 400;

        return (
          <div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              left: point.x,
              top: point.y,
              width: "6px",
              height: "6px",
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity,
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          />
        );
      })}
    </div>
  );
}
