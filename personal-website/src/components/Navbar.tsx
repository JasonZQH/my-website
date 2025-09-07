"use client"; 
// Next.js 13 App Router 中，如果组件里要使用交互(例如 useState/useEffect)，需要加 "use client"

import Link from "next/link";
import { motion } from "framer-motion";
// 引入所需的图标
import { IoPerson } from "react-icons/io5";
import { MdTimeline, MdConnectWithoutContact } from "react-icons/md";
import { GrWorkshop } from "react-icons/gr";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full py-4 px-8 flex items-center justify-between bg-black/80 backdrop-blur-sm border-b border-gray-800/50 z-50">
      <motion.div 
        className="text-xl font-bold"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Link href="/">Qinhao Zhang</Link>
      </motion.div>
      <div className="flex gap-10 items-center">
        {/* About: IoPerson */}
        <Link href="/about" aria-label="About Me">
          <motion.div
            className="nav-icon"
            whileHover={{ 
               y: -2, 
               scale: 1.1,
               color: "#10b981",
               rotate: 10
             }}
             transition={{ type: "spring", stiffness: 300 }}
          >
            <IoPerson className="w-6 h-6" />
          </motion.div>
        </Link>
        {/* Experience: MdTimeline */}
        <Link href="/experience" aria-label="Experience">
          <motion.div
            className="nav-icon"
            whileHover={{ 
              y: -2, 
              scale: 1.1,
              color: "#3b82f6",
              rotateZ: 360
            }}
            transition={{ type: "spring", stiffness: 300, duration: 0.6 }}
          >
            <MdTimeline className="w-6 h-6" />
          </motion.div>
        </Link>
        {/* Projects: GrWorkshop */}
        <Link href="/project" aria-label="Projects">
          <motion.div
            className="nav-icon"
            whileHover={{ 
               y: -2, 
               scale: 1.1,
               color: "#8b5cf6",
               rotate: 15
             }}
             transition={{ type: "spring", stiffness: 300 }}
          >
            <GrWorkshop className="w-6 h-6" />
          </motion.div>
        </Link>
        {/* Suggestion: MdConnectWithoutContact */}
        <Link href="/suggestion" aria-label="Suggestion">
          <motion.div
            className="nav-icon"
            whileHover={{ 
               y: -2, 
               scale: 1.1,
               color: "#f59e0b",
               rotate: -10
             }}
             transition={{ type: "spring", stiffness: 300 }}
          >
            <MdConnectWithoutContact className="w-6 h-6" />
          </motion.div>
        </Link>
      </div>
    </nav>
  );
}
