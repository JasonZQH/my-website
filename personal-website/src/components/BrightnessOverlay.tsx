"use client";

import React, { useEffect } from "react";
import { Slider } from "@heroui/react"; // HeroUI 的 Slider 组件
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: "400", // 可根据需要选择粗细
  subsets: ["latin"],
});

interface BrightnessOverlayProps {
  brightness: number; // 0:全黑, 100:全亮
  setBrightness: (val: number) => void;
}

export default function BrightnessOverlay({ brightness, setBrightness }: BrightnessOverlayProps) {
  // 当 brightness < 100 时，显示覆盖层
  const showOverlay = brightness < 100;
  // 黑幕透明度：从 1 (全黑) 到 0 (全亮)
  const overlayOpacity = 1 - brightness / 100;

  // 注意：不再包含 Reset 按钮，Reset 功能由 Footer 处理

  useEffect(() => {
    // 此处可以根据需要处理其它副作用，目前无额外操作
  }, [brightness]);

  return (
    <>
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 bg-black transition-opacity duration-300"
          style={{ opacity: overlayOpacity }}
        >
          {/* 使用一个 flex 容器垂直排列文字和滑块，并整体居中 */}
          <div className="flex flex-col items-center justify-center h-full">
            <p className={`${orbitron.className} text-md animate-breathe text-center mb-2`}>
              Slide To Open
            </p>
            <div className="slider-half" style={{ width: "50vw" }}>
              <Slider
                aria-label="Brightness slider"
                value={brightness}
                onChange={(val: number | number[]) => {
                  if (typeof val === "number") {
                    setBrightness(val);
                  } else if (Array.isArray(val)) {
                    setBrightness(val[0]);
                  }
                }}
                minValue={0}
                maxValue={100}
                step={1}
                className="w-full h-10"
                color="foreground"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
