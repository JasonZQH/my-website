"use client"; 
// Next.js 13 App Router 中，如果组件里要使用交互(例如 useState/useEffect)，需要加 "use client"

import Link from "next/link";
// 引入所需的图标
import { IoPerson } from "react-icons/io5";
import { MdTimeline, MdConnectWithoutContact } from "react-icons/md";
import { GrWorkshop } from "react-icons/gr";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full py-4 px-8 flex items-center justify-between bg-gray-900 z-50">
      <div className="text-xl font-bold">
        <Link href="/?lit=true">Qinhao Zhang</Link>
      </div>
      <div className="flex gap-10 items-center">
        {/* About: IoPerson */}
        <Link href="/about" className="hover:text-gray-300" aria-label="About Me">
          <IoPerson className="w-6 h-6" />
        </Link>
        {/* Experience: MdTimeline */}
        <Link href="/experience" className="hover:text-gray-300" aria-label="Experience">
          <MdTimeline className="w-6 h-6" />
        </Link>
        {/* Projects: GrWorkshop */}
        <Link href="/project" className="hover:text-gray-300" aria-label="Projects">
          <GrWorkshop className="w-6 h-6" />
        </Link>
        {/* Suggestion: MdConnectWithoutContact (替代 MdConnectWithContact) */}
        <Link href="/suggestion" className="hover:text-gray-300" aria-label="Suggestion">
          <MdConnectWithoutContact className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
