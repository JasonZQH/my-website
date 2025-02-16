"use client"; 
// Next.js 13 App Router 中，如果组件里要使用交互(例如 useState/useEffect)，需要加 "use client"

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between bg-gray-900">
      <div className="text-xl font-bold">
        <Link href="/">Qinhao Zhang</Link>
      </div>
      <div className="flex gap-6">
        <Link href="/about" className="hover:text-gray-300">
          About
        </Link>
        <Link href="/projects" className="hover:text-gray-300">
          Projects
        </Link>
        <Link href="/contact" className="hover:text-gray-300">
          Contact
        </Link>
      </div>
    </nav>
  );
}
