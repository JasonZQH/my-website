"use client";

import React from "react";
import { FaEnvelope, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

interface FooterProps {
  brightness: number;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Footer({ brightness, onToggle }: FooterProps) {
  return (
    <footer className="fixed z-10 bottom-0 left-0 w-full py-4 px-8 bg-gray-900 text-gray-400 text-sm flex items-center justify-between z-50">
      <div>© {new Date().getFullYear()} Qinhao Zhang. All rights reserved.</div>
      <div className="flex gap-4 items-center">
        <a href="zhang.qinha@northeastern.edu" className="hover:text-white" aria-label="Send me an email">
          <FaEnvelope className="w-5 h-5" />
        </a>
        <a href="https://github.com/JasonZQH" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="My Github">
          <FaGithub className="w-5 h-5" />
        </a>
        <a href="https://www.linkedin.com/in/qinhaozhang98/" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="My LinkedIn">
          <FaLinkedin className="w-5 h-5" />
        </a>
        <a href="https://www.instagram.com/str8up__z?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="My Instagram">
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
