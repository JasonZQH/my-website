"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BrightnessOverlay from "@/components/BrightnessOverlay";
import Footer from "@/components/Footer";

export default function HomePage() {
  const searchParams = useSearchParams();
  const lit = searchParams.get("lit") === "true";
  const [brightness, setBrightness] = useState(lit ? 100 : 0);

  useEffect(() => {
    if (lit) {
      setBrightness(100);
    }
  }, [lit]);

  // 切换 toggle：如果 checked 为 false，设为0（显示覆盖层）；如果为 true，设为100（全亮）
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setBrightness(100);
    } else {
      setBrightness(0);
    }
  };

  return (
    <div className="relative bg-black text-white flex flex-col flex-grow min-h-screen">
      {brightness < 100 && (
        <BrightnessOverlay brightness={brightness} setBrightness={setBrightness} />
      )}

      <section className="relative z-10 flex flex-col items-center justify-center flex-grow pt-16 pb-16">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradientText">
        &quot;The best way to predict the future is to create it.&quot;
        </h1>
        <p className="mt-4 max-w-md text-center text-gray-300">
          Seeking An Opportunity To Get a Better Self-Development and Creativity
        </p>
      </section>

      {/* 将 Footer 传递 brightness 和 onToggle */}
      <Footer brightness={brightness} onToggle={handleToggleChange} />
    </div>
  );
}
