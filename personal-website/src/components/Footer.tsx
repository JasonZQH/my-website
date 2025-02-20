"use client";

import React from "react";
import { FaEnvelope, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

interface FooterProps {
  brightness: number;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Footer({ brightness, onToggle }: FooterProps) {
  return (
    <footer className="fixed z-10 bottom-0 left-0 w-full py-4 px-8 bg-gray-900 text-gray-400 text-sm flex items-center justify-between">
      <div>© {new Date().getFullYear()} Qinhao Zhang. All rights reserved.</div>
      <div className="flex gap-4 items-center">
        <a href="mailto:your_email@example.com" className="hover:text-white" aria-label="Send me an email">
          <FaEnvelope className="w-5 h-5" />
        </a>
        <a href="https://github.com/your_github" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="My Github">
          <FaGithub className="w-5 h-5" />
        </a>
        <a href="https://www.linkedin.com/in/your_linkedin" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="My LinkedIn">
          <FaLinkedin className="w-5 h-5" />
        </a>
        <a href="https://instagram.com/your_instagram" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="My Instagram">
          <FaInstagram className="w-5 h-5" />
        </a>

        {/* DaisyUI Theme Toggle，受控于 brightness */}
        <input
          type="checkbox"
          className="toggle theme-controller"
          checked={brightness === 100}
          onChange={onToggle}
          aria-label="Toggle theme"
        />
      </div>
    </footer>
  );
}
