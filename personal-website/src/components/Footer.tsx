"use client";

import React from "react";

interface FooterProps {
  onReset?: () => void;
}

export default function Footer({ onReset }: FooterProps) {
  return (
    <footer className="w-full py-4 px-8 bg-gray-900 text-gray-400 text-sm flex items-center justify-between">
      <div>© {new Date().getFullYear()} Qinhao Zhang. All rights reserved.</div>
      {onReset && (
        <button
          onClick={onReset}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow"
        >
          Reset Darkness
        </button>
      )}
    </footer>
  );
}
