"use client";
import { useEffect, useState } from "react";
import FlowingLine from "./FlowingLine";

const LINE_HEIGHT = 40; // in px (tailwind h-10)
const FONT_SIZES = ["text-base", "text-lg", "text-xl", "text-2xl", "text-lg", "text-base", "text-xl"];

export default function FlowingBackground() {
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    const updateLineCount = () => {
      const screenHeight = window.innerHeight;
      const count = Math.floor(screenHeight / LINE_HEIGHT);
      setLineCount(count);
    };

    updateLineCount();
    window.addEventListener("resize", updateLineCount);
    return () => window.removeEventListener("resize", updateLineCount);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {Array.from({ length: lineCount }).map((_, i) => {
  const randomDelay = Math.floor(Math.random() * 1000); // between 0–1000 ms
  return (
    <div
      key={i}
      className="absolute w-full"
      style={{ top: `${i * LINE_HEIGHT}px` }}
    >
      <FlowingLine direction={i % 2 === 0 ? "left" : "right"} delay={randomDelay} fontSize={FONT_SIZES[i % FONT_SIZES.length]} />
    </div>
  );
})}

    </div>
  );
}