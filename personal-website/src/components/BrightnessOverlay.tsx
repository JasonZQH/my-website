"use client";

import React, { useEffect } from "react";
import { Slider } from "@heroui/react"; // HeroUI 的 Slider 组件

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-300"
          style={{ opacity: overlayOpacity }}
        >
          {/* 可选：显示提示文字 */}
          {/* <div className="text-white mb-4 text-lg">Slide to brighten</div> */}
          <div className="flex flex-col gap-2 w-full h-full max-w-md items-center justify-center">
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
              // 采用 HeroUI Slider 默认样式，必要时可通过 className 自定义
              className="max-w-md"
              color="foreground"
            />
          </div>
        </div>
      )}
    </>
  );
}
