"use client"; 
// Next.js 13 App Router 中，如果组件里要使用交互(例如 useState/useEffect)，需要加 "use client"

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full py-4 px-8 flex items-center justify-between bg-gray-900 z-30">
      <div className="text-xl font-bold">
        <Link href="/?lit=true">Qinhao Zhang</Link>
      </div>
      <div className="flex gap-6">
        <Link href="/about" className="hover:text-gray-300">
          About
        </Link>
        <Link href="/experience" className="hover:text-gray-300">
          Experience
        </Link>
        <Link href="/project" className="hover:text-gray-300">
          Project/Publish
        </Link>
        <Link href="/suggestion" className="hover:text-gray-300">
          Suggestion
        </Link>
      </div>
    </nav>
  );
}
