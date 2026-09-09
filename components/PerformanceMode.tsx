"use client";

import { useEffect } from "react";

export default function PerformanceMode() {
  useEffect(() => {
    let timer: number | null = null;

    const handleScroll = () => {
      document.documentElement.classList.add("is-scrolling");

      if (timer !== null) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 180);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return null;
}