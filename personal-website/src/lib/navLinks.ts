// Single source of truth for the section anchors — rendered by both the
// in-hero nav (Hero.tsx) and the fixed reveal bar (Navbar.tsx).
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;
