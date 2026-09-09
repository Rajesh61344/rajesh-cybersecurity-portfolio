"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type AnimationType =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = "up",
  delay = 0,
  duration = 700,
  distance = 35,
  threshold = 0.01,
  once = false,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* ==========================================
     REDUCED MOTION
  ========================================== */

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setReducedMotion(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  /* ==========================================
     INITIAL VIEWPORT CHECK
     
     Important:
     Elements already visible when page loads
     animate immediately.
  ========================================== */

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const rect = element.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight ||
      document.documentElement.clientHeight;

    const alreadyVisible =
      rect.top < viewportHeight &&
      rect.bottom > 0;

    if (alreadyVisible) {
      const timer = window.setTimeout(() => {
        setVisible(true);
      }, delay);

      return () => {
        window.clearTimeout(timer);
      };
    }

    /* ========================================
       SCROLL OBSERVER
    ======================================== */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "100px 0px 100px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    delay,
    once,
    threshold,
    reducedMotion,
  ]);

  /* ==========================================
     INITIAL TRANSFORM
  ========================================== */

  const getInitialTransform = () => {
    if (reducedMotion) {
      return "translate3d(0,0,0) scale(1)";
    }

    switch (animation) {
      case "up":
        return `translate3d(0,${distance}px,0) scale(1)`;

      case "down":
        return `translate3d(0,-${distance}px,0) scale(1)`;

      case "left":
        return `translate3d(${distance}px,0,0) scale(1)`;

      case "right":
        return `translate3d(-${distance}px,0,0) scale(1)`;

      case "scale":
        return "translate3d(0,0,0) scale(0.92)";

      case "fade":
        return "translate3d(0,0,0) scale(1)";

      default:
        return `translate3d(0,${distance}px,0) scale(1)`;
    }
  };

  /* ==========================================
     FINAL STATE
  ========================================== */

  const transform =
    visible || reducedMotion
      ? "translate3d(0,0,0) scale(1)"
      : getInitialTransform();

  const opacity =
    visible || reducedMotion ? 1 : 0;

  const filter =
    visible || reducedMotion
      ? "blur(0px)"
      : "blur(4px)";

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity,
        transform,
        filter,

        transitionProperty:
          "opacity, transform, filter",

        transitionDuration:
          reducedMotion
            ? "0ms"
            : `${duration}ms`,

        transitionTimingFunction:
          "cubic-bezier(0.16, 1, 0.3, 1)",

        transitionDelay:
          reducedMotion
            ? "0ms"
            : `${delay}ms`,

        willChange:
          visible
            ? "auto"
            : "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}