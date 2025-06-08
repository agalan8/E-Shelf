import React, { useEffect, useState } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-8 left-1/2 transform -translate-x-1/2 z-50
        flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl
        border border-purple-400
        transition-all duration-300
        ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        ${type === "success"
          ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
          : "bg-gradient-to-r from-purple-700 to-pink-600 text-white"}
        dark:from-purple-800 dark:to-purple-950
        dark:border-purple-700
      `}
      style={{ minWidth: "320px", maxWidth: "90vw" }}
    >
      <div className="flex-shrink-0">
        {type === "success" ? (
          <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="2" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" className="stroke-white" strokeWidth="2" fill="none"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-pink-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" className="stroke-pink-300 dark:stroke-pink-600" strokeWidth="2" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" className="stroke-white" strokeWidth="2" fill="none"/>
          </svg>
        )}
      </div>
      <span className="font-medium text-base">{message}</span>
    </div>
  );
}
