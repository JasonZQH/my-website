// Single source of truth for the section anchors — rendered by both the
// in-hero nav (Hero.tsx) and the fixed reveal bar (Navbar.tsx).
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;
