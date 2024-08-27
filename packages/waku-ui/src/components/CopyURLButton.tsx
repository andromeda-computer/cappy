"use client";

import { useState, useEffect } from "react";
import { DatabaseMetadata } from "../lib/types";
import { getFileURL } from "../lib/utils";

const CopyURLButton = ({ file }: { file: DatabaseMetadata }) => {
  const [showToast, setShowToast] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showToast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(getFileURL(file));
    setShowToast(true);
  };

  const handleTransitionEnd = () => {
    if (!isVisible) {
      setShowToast(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="text-purple-300 hover:text-purple-400"
      >
        [copy url]
      </button>
      {showToast && (
        <div
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-md transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onTransitionEnd={handleTransitionEnd}
        >
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyURLButton;
