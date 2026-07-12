"use client";

import { useState, FormEvent } from "react";
import FadeIn from "@/components/ui/FadeIn";
import AuroraPill from "@/components/ui/AuroraPill";

const FIELDS = ["Software Engineering", "AI / ML", "Data Science", "Web Development", "Other"];

const INPUT_CLASSES =
  "w-full text-[15px] text-[#D7E2EA] bg-[#141414] border border-[rgba(215,226,234,.15)] rounded-xl px-[15px] py-[13px] outline-none focus:border-[#B600A8]";

const LABEL_CLASSES =
  "block text-[13px] uppercase tracking-[.1em] text-[rgba(215,226,234,.7)] mb-[9px]";

export default function Contact() {
  const [field, setField] = useState(FIELDS[0]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [canRefer, setCanRefer] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, email, message, canRefer, isRecruiter }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
      setEmail("");
      setMessage("");
      setCanRefer(false);
      setIsRecruiter(false);
      setTimeout(() => setStatus("idle"), 4500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4500);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 px-[clamp(20px,4vw,40px)] py-[clamp(90px,10vw,130px)]"
    >
      <div className="max-w-[840px] mx-auto">
        <div className="text-center">
          <FadeIn y={40}>
            <h2 className="steel-text font-black uppercase tracking-[-.02em] leading-none text-[clamp(3rem,10vw,120px)]">
              Let&apos;s talk
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="mt-[18px] font-light text-[rgba(215,226,234,.6)] text-[clamp(1rem,1.6vw,1.2rem)]">
              Recruiting, referrals, or just ideas — i&apos;d love to hear from you.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.14} className="mt-[clamp(34px,5vw,54px)]">
          <form
            onSubmit={handleSubmit}
            className="text-left bg-[rgba(255,255,255,.03)] border border-[rgba(215,226,234,.12)] rounded-[28px] p-[clamp(22px,3vw,40px)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              <div>
                <label htmlFor="contact-field" className={LABEL_CLASSES}>
                  Your field
                </label>
                <select
                  id="contact-field"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className={INPUT_CLASSES}
                >
                  {FIELDS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-email" className={LABEL_CLASSES}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            <div className="mt-[18px]">
              <label htmlFor="contact-message" className={LABEL_CLASSES}>
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                placeholder="Tell me about the role or idea…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${INPUT_CLASSES} resize-none`}
              />
            </div>

            <div className="flex items-center gap-[22px] mt-[18px] flex-wrap">
              <label className="flex items-center gap-[9px] text-sm font-light text-[rgba(215,226,234,.75)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={canRefer}
                  onChange={(e) => setCanRefer(e.target.checked)}
                  className="w-[17px] h-[17px] accent-[#B600A8]"
                />
                I can offer a referral
              </label>
              <label className="flex items-center gap-[9px] text-sm font-light text-[rgba(215,226,234,.75)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecruiter}
                  onChange={(e) => setIsRecruiter(e.target.checked)}
                  className="w-[17px] h-[17px] accent-[#B600A8]"
                />
                I&apos;m a recruiter
              </label>
            </div>

            <div className="flex items-center gap-[18px] mt-[26px] flex-wrap">
              <AuroraPill type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </AuroraPill>
              {status === "sent" && (
                <span className="text-sm text-[#57E39B]">
                  ✓ Thanks — i&apos;ll be in touch soon.
                </span>
              )}
              {status === "error" && (
                <span className="text-sm text-[#FF7A7A]">
                  Something went wrong — try the email link in the footer instead.
                </span>
              )}
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
