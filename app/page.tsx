"use client";
import FlowingBackground from "./FlowingBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 overflow-hidden">
      {/* 🌟 Fullscreen background flow */}
      <FlowingBackground />

      {/* 🌟 Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-6xl font-extrabold text-white leading-tight tracking-tight text-center mb-6 drop-shadow-lg">
          ShitchatAI
        </h1>

        <p className="text-2xl md:text-3xl text-white opacity-80 mb-12 text-center leading-relaxed">
          Just like other AI sites, but shittier.
        </p>

        <a
          href="/chats"
          className="bg-white hover:bg-blue-50 text-blue-600 font-semibold py-4 px-8 rounded-xl shadow-xl transform transition duration-300 ease-in-out hover:scale-105 mt-8"
        >
          Enter
        </a>
      </div>
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-50">
        Use it at your own risk.
      </footer>
    </div>
  );
}
