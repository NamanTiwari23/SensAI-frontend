// AlienCursorFollower.tsx
import { useEffect, useState } from "react";

const AlienCursorFollower = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <img
      src="/ss.png" // Make sure this has transparent background
      alt="Spaceship"
      className="fixed z-50 w-20 h-20 pointer-events-none transition-transform duration-75 ease-linear"
      style={{
        transform: `translate(${pos.x - 10}px, ${pos.y - 10}px)`, // Adjust offset to align image's nose to cursor
      }}
    />
  );
};

export default AlienCursorFollower;
