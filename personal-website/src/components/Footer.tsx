"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-6 px-8 bg-black/80 backdrop-blur-sm border-t border-gray-800/50 z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Social Media Icons */}
        <div className="flex gap-6 items-center">
          <motion.a 
            href="mailto:zhang.qinha@northeastern.edu" 
            aria-label="Send me an email"
            className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            whileHover={{ 
              scale: 1.1, 
              y: -3,
              boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaEnvelope className="w-5 h-5 text-red-400" />
          </motion.a>
          <motion.a 
            href="https://github.com/JasonZQH" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="My Github"
            className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            whileHover={{ 
              scale: 1.1, 
              y: -3,
              rotate: 360,
              boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaGithub className="w-5 h-5 text-white" />
          </motion.a>
          <motion.a 
            href="https://www.linkedin.com/in/qinhaozhang98/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="My LinkedIn"
            className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            whileHover={{ 
              scale: 1.1, 
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 119, 181, 0.3)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaLinkedin className="w-5 h-5 text-blue-400" />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/str8up__z?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="My Instagram"
            className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            whileHover={{ 
              scale: 1.1, 
              y: -3,
              rotate: 10,
              boxShadow: "0 10px 25px rgba(228, 64, 95, 0.3)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaInstagram className="w-5 h-5 text-pink-400" />
          </motion.a>
        </div>
        
        {/* Copyright */}
        <motion.div
          className="text-gray-400 text-sm text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Qinhao Zhang. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
