"use client";
import Link from "next/link";
import FlowingBackground from "./FlowingBackground";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  // Check consent only on client side
  useEffect(() => {
    const hasConsent = localStorage.getItem("storage-consent") === "true";
    setConsentGiven(hasConsent);
  }, []);

  const handleAcceptConsent = () => {
    localStorage.setItem("storage-consent", "true");
    setConsentGiven(true);
  };

  // Show consent banner if no consent given
  if (consentGiven === false) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Age Verification Section */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              🔞 Age Verification
            </h2>
            <p className="text-gray-600 mb-4">
              You must be <strong>13 years or older</strong> to use ShitchatAI,
              in compliance with COPPA and GDPR regulations.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> While this app doesn't collect personal
                data, AI interactions may generate content unsuitable for
                children.
              </p>
            </div>
          </div>

          {/* Data Consent Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📝 Data Storage Consent
            </h3>
            <p className="text-gray-600 mb-2">
              ShitchatAI uses your browser's local storage to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 text-sm space-y-1">
              <li>Save your chat conversations locally</li>
              <li>Store character profiles and settings</li>
              <li>Remember your preferences and API settings</li>
              <li>Cache images you upload for characters</li>
            </ul>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                <strong>✓ All data stays on your device</strong> - Nothing is
                sent to our servers except API requests to OpenRouter.
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center text-gray-500 text-xs mb-4">
            By clicking "I'm 13+ & Accept", you confirm you're 13+ and agree to
            our{" "}
            <Link
              href="/privacy"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAcceptConsent}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              ✅ I'm 13+ & Accept
            </button>

            <button
              onClick={() => (window.location.href = "https://www.google.com/")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              ❌ I'm under 13 / Decline
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Declining will prevent the app from functioning, as local storage
              is required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking consent
  if (consentGiven === null) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 overflow-hidden">
      {/* 🌟 Fullscreen background flow */}
      <FlowingBackground />

      {/* 🌟 Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInSlow {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <h1
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight text-center mb-4 drop-shadow-lg"
          style={{ animation: "fadeIn 0.7s ease both" }}
        >
          ShitchatAI
        </h1>

        <p
          className="text-xl md:text-2xl text-white opacity-80 mb-8 text-center leading-relaxed"
          style={{ animation: "fadeInSlow 0.9s ease both" }}
        >
          Just like other AI sites, but shittier.
        </p>

        <Link
          href="/chats"
          className="bg-white hover:bg-blue-50 text-blue-600 font-semibold py-4 px-10 rounded-xl shadow-xl transform transition duration-300 ease-in-out hover:scale-105"
        >
          Enter
        </Link>
      </div>
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-50 z-99">
        Use it at your own risk. {" | "}
        <Link
          href="/privacy"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}