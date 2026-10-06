"use client";

import { useEffect, useRef } from "react";

/**
 * Adsterra banner — drop-in for the invoke.js style snippet:
 *
 *   <script async data-cfasync="false" src="https://pl31691920.profitableratecpmnetwork.com/7025c8910808cdbe6ca440a3fff1cd72/invoke.js"></script>
 *   <div id="container-7025c8910808cdbe6ca440a3fff1cd72"></div>
 */

const AD_SRC =
  "https://pl31691920.profitableratecpmnetwork.com/7025c8910808cdbe6ca440a3fff1cd72/invoke.js";
const AD_CONTAINER_ID = "container-7025c8910808cdbe6ca440a3fff1cd72";

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = "" }: AdBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    // Avoid double-injecting on re-renders
    if (wrapper.querySelector("script")) return;

    // The div Adsterra targets
    const adDiv = document.createElement("div");
    adDiv.id = AD_CONTAINER_ID;
    wrapper.appendChild(adDiv);

    // The invoke script
    const script = document.createElement("script");
    script.src = AD_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    wrapper.appendChild(script);

    return () => {
      if (wrapper) wrapper.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
      aria-label="Advertisement"
    />
  );
}
