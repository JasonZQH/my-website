"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-[#08050C] text-[#F4EEE3] px-6 sm:px-10 pt-20 pb-11 overflow-hidden">
      <div
        className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[70%] h-[120%] opacity-[.16] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle,#7B5CFF,transparent 60%)" }}
      />
      <div className="relative max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display font-extrabold text-[clamp(44px,9vw,120px)] leading-[.9] tracking-[-.03em] bg-clip-text text-transparent [background-size:220%_220%] animate-[gradShift_8s_ease_infinite]"
          style={{ backgroundImage: "linear-gradient(115deg,#FF5A3C,#FF2E93 45%,#7B5CFF 75%,#24D3EE)" }}
        >
          Jason Zhang
        </motion.div>
        <div className="flex gap-3.5 justify-center mt-10 flex-wrap">
          <a
            href="mailto:zhang.qinha@northeastern.edu"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#FF5A3C] hover:text-[#FF5A3C]"
          >
            Email
          </a>
          <a
            href="https://github.com/JasonZQH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#F4EEE3]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/qinhaozhang98/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#24D3EE] hover:text-[#24D3EE]"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/str8up__z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#FF2E93] hover:text-[#FF2E93]"
          >
            Instagram
          </a>
        </div>
        <div className="mt-11 font-mono text-xs text-[#6B6377]">
          © {new Date().getFullYear()} Jason Zhang · Designed &amp; built with care
        </div>
      </div>
    </footer>
  );
}
