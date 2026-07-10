"use client";

import { useState, FormEvent } from "react";

const FIELDS = ["Software Engineering", "Data Science", "AI / ML", "Web Development", "Other"];

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
    <section id="contact" className="scroll-mt-[90px] bg-[#F4EEE3] text-[#1A1220] px-6 sm:px-10 py-[120px]">
      <div className="max-w-[920px] mx-auto">
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8A5CFF] mb-4">/ contact</div>
          <h2 className="font-display font-extrabold text-[clamp(36px,5.2vw,68px)] leading-none tracking-[-.025em]">
            Let&apos;s build
            <br />
            something.
          </h2>
          <p className="text-[#6B6470] text-[17px] mt-[18px]">
            Recruiting, referrals, or just ideas — I&apos;d love to hear from you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[26px] p-6 sm:p-9 border border-black/[.06] shadow-[0_30px_70px_rgba(26,18,32,.08)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#4A4353] mb-2">Your field</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full font-body text-[15px] text-[#1A1220] bg-[#F4EEE3] border border-black/[.08] rounded-xl px-3.5 py-3 outline-none focus:border-[#7B5CFF]"
              >
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#4A4353] mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-body text-[15px] text-[#1A1220] bg-[#F4EEE3] border border-black/[.08] rounded-xl px-3.5 py-3 outline-none focus:border-[#7B5CFF]"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-[13px] font-semibold text-[#4A4353] mb-2">Message</label>
            <textarea
              rows={4}
              required
              placeholder="Tell me about the role or idea…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full font-body text-[15px] text-[#1A1220] bg-[#F4EEE3] border border-black/[.08] rounded-xl px-3.5 py-3 outline-none focus:border-[#7B5CFF] resize-none"
            />
          </div>

          <div className="flex items-center gap-5 mt-5 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-[#4A4353] cursor-pointer">
              <input
                type="checkbox"
                checked={canRefer}
                onChange={(e) => setCanRefer(e.target.checked)}
                className="w-[17px] h-[17px] accent-[#7B5CFF]"
              />
              I can offer a referral
            </label>
            <label className="flex items-center gap-2 text-sm text-[#4A4353] cursor-pointer">
              <input
                type="checkbox"
                checked={isRecruiter}
                onChange={(e) => setIsRecruiter(e.target.checked)}
                className="w-[17px] h-[17px] accent-[#7B5CFF]"
              />
              I&apos;m a recruiter
            </label>
          </div>

          <div className="flex items-center gap-[18px] mt-7 flex-wrap">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2.5 font-body font-bold text-[15px] text-white px-[30px] py-[15px] rounded-full shadow-[0_14px_34px_rgba(255,46,147,.28)] transition hover:brightness-[1.07] hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(120deg,#FF5A3C,#FF2E93 55%,#7B5CFF)" }}
            >
              {status === "sending" ? "Sending…" : "Send message →"}
            </button>
            {status === "sent" && (
              <span className="font-mono text-sm text-[#1F9B5B]">✓ Thanks — I&apos;ll be in touch soon.</span>
            )}
            {status === "error" && (
              <span className="font-mono text-sm text-[#C0392B]">
                Something went wrong — try the email link in the footer instead.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
