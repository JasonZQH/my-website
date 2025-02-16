"use client";

import React, { useState } from "react";
import BrightnessOverlay from "@/components/BrightnessOverlay";
import Footer from "@/components/Footer";

export default function HomePage() {
  // brightness 的范围 0～100
  const [brightness, setBrightness] = useState(0);

  // Reset 回调：将 brightness 重置为 0，使覆盖层重新显示（全黑状态）
  const handleReset = () => {
    setBrightness(0);
  };

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      {/* 亮度覆盖层：初始全黑，拖动后逐渐消失 */}
      <BrightnessOverlay brightness={brightness} setBrightness={setBrightness} />

      {/* 主页内容 */}
      <section className="flex flex-col items-center justify-center flex-grow">
        <h1
          className="
            text-4xl font-bold 
            bg-gradient-to-r from-green-400 via-blue-500 to-purple-500
            bg-clip-text text-transparent
            bg-[length:200%_200%]
            animate-gradientText
          "
        >
          AI Innovation & Development
        </h1>
        <p className="mt-4 max-w-md text-center text-gray-300">
          A short slogan with gradient animation...
        </p>
      </section>

      {/* Footer 固定在页面底部 */}
      <Footer onReset={handleReset} />
    </main>
  );
}
