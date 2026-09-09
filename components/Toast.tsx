"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Info,
  X,
} from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  duration = 3500,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => {
      setVisible(true);
    }, 20);

    const closeTimer = window.setTimeout(() => {
      setVisible(false);

      window.setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      title: "Success",
      iconClass: "text-emerald-300",
      borderClass: "border-emerald-400/20",
      bgClass: "bg-emerald-400/[0.07]",
      glowClass:
        "shadow-[0_0_35px_rgba(16,185,129,0.16)]",
      barClass: "bg-emerald-300/70",
    },

    error: {
      icon: XCircle,
      title: "Error",
      iconClass: "text-red-300",
      borderClass: "border-red-400/20",
      bgClass: "bg-red-400/[0.07]",
      glowClass:
        "shadow-[0_0_35px_rgba(239,68,68,0.16)]",
      barClass: "bg-red-300/70",
    },

    info: {
      icon: Info,
      title: "Information",
      iconClass: "text-cyan-300",
      borderClass: "border-cyan-400/20",
      bgClass: "bg-cyan-400/[0.07]",
      glowClass:
        "shadow-[0_0_35px_rgba(34,211,238,0.16)]",
      barClass: "bg-cyan-300/70",
    },
  }[type];

  const Icon = config.icon;

  function closeToast() {
    setVisible(false);

    window.setTimeout(() => {
      onClose();
    }, 300);
  }

  return (
    <div
      className={`
        fixed right-5 top-5 z-[99999]
        w-[min(390px,calc(100vw-40px))]
        transition-all duration-300 ease-out
        ${
          visible
            ? "translate-x-0 opacity-100"
            : "translate-x-[120%] opacity-0"
        }
      `}
    >
      <div
        className={`
          relative overflow-hidden
          rounded-2xl border
          ${config.borderClass}
          ${config.bgClass}
          ${config.glowClass}
          bg-[#071018]/95
          p-4
          backdrop-blur-2xl
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-white/[0.08]
              bg-black/20
            "
          >
            <Icon
              size={21}
              className={`
                ${config.iconClass}
                animate-[toastIcon_0.45s_ease-out]
              `}
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {config.title}
            </p>

            <p className="mt-1 text-sm leading-5 text-white/55">
              {message}
            </p>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={closeToast}
            aria-label="Close notification"
            className="
              rounded-lg p-1
              text-white/30
              transition
              hover:bg-white/5
              hover:text-white/70
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div
          className={`
            absolute bottom-0 left-0
            h-[2px] w-full
            origin-left
            ${config.barClass}
            animate-[toastProgress_3500ms_linear_forwards]
          `}
        />
      </div>
    </div>
  );
}