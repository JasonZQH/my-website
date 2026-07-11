const PILL_CLASSES =
  "inline-flex items-center justify-center font-medium uppercase tracking-[.14em] text-[clamp(.72rem,1vw,1rem)] text-white px-[clamp(28px,3vw,48px)] py-[14px] rounded-full whitespace-nowrap transition hover:brightness-[1.08] hover:-translate-y-0.5 disabled:opacity-60";

const PILL_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(123deg,var(--acc1) 7%,var(--acc2) 37%,var(--acc3) 72%,var(--acc4) 100%)",
  boxShadow: "0 4px 4px rgba(181,1,167,.25), 4px 4px 12px #7721B1 inset",
  outline: "2px solid #fff",
  outlineOffset: "-3px",
  border: "none",
};

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Render an anchor when set; otherwise a button. */
  href?: string;
  type?: "submit" | "button";
  disabled?: boolean;
};

/** v3 aurora CTA pill — gradient fill, inset glow, inner white outline. */
export default function AuroraPill({ children, className, href, type = "button", disabled }: Props) {
  const cls = className ? `${PILL_CLASSES} ${className}` : PILL_CLASSES;
  if (href) {
    return (
      <a href={href} className={cls} style={PILL_STYLE}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} className={cls} style={PILL_STYLE}>
      {children}
    </button>
  );
}
