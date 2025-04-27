// components/Notification.tsx
"use client";

import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  show: boolean;
  duration?: number;
  onClose: () => void;
}

export default function Notification({ message, type, show, duration, onClose }: NotificationProps) {

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-blue-600";

  return (
    <div
      className={` fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300`}
    >
      <div className="flex items-center">
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-3 font-bold hover:opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  );
}
