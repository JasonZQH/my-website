export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 sm:px-10 py-[18px] backdrop-blur-2xl bg-[#0B0711]/[.55] border-b border-white/[.07]">
      <a href="#top" className="flex items-center gap-3 text-[#F4EEE3]">
        <span
          className="w-3.5 h-3.5 rounded-full shadow-[0_0_14px_#FF2E93] inline-block"
          style={{ background: "linear-gradient(120deg,#FF5A3C,#7B5CFF)" }}
        />
        <span className="font-display font-bold text-[17px] tracking-[-.01em]">Jason Zhang</span>
      </a>
      <div className="flex items-center gap-4 sm:gap-[34px]">
        <a href="#about" className="text-xs sm:text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">About</a>
        <a href="#stack" className="text-xs sm:text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">Stack</a>
        <a href="#experience" className="hidden sm:inline text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">Experience</a>
        <a href="#work" className="text-xs sm:text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">Work</a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B0711] px-3.5 sm:px-[18px] py-2 sm:py-2.5 rounded-full transition hover:brightness-[1.08]"
          style={{ background: "linear-gradient(120deg,#FF5A3C,#FF2E93 55%,#7B5CFF)" }}
        >
          Let&apos;s talk
        </a>
      </div>
    </nav>
  );
}
