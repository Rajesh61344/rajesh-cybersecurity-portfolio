"use client";

import { useEffect } from "react";

export default function ScrollFX() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;

      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${progress}%`
      );

      document.documentElement.style.setProperty(
        "--scroll-y",
        `${scrollTop}px`
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
      );
    };

    window.addEventListener("mousemove", move);

    return () =>
      window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full">
        <div className="scroll-progress h-full" />
      </div>

      <div className="pointer-events-none fixed inset-0 z-[9998]">
        <div className="cursor-glow" />
      </div>
    </>
  );
}