"use client";

import { useEffect } from "react";

/**
 * Adsterra social-bar / pop ads — loads once globally.
 */

const AD_SCRIPTS = [
  "https://pl31691919.profitableratecpmnetwork.com/a9/6a/1e/a96a1ef92b2d1dc28d9e376f6f79c5d8.js",
  "https://pl31691922.profitableratecpmnetwork.com/fb/a1/da/fba1dab6dddc19a65f97064b8216131e.js",
];

export function AdScript() {
  useEffect(() => {
    const injected: HTMLScriptElement[] = [];

    for (const src of AD_SCRIPTS) {
      if (document.querySelector(`script[src="${src}"]`)) continue;
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
      injected.push(script);
    }

    return () => {
      injected.forEach((s) => s.remove());
    };
  }, []);

  return null;
}
