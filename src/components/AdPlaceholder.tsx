import React from 'react';

interface AdPlaceholderProps {
  width: string;
  height: string;
  text?: string;
  className?: string;
}

export default function AdPlaceholder({ width, height, text = "Reklam Alanı", className = "" }: AdPlaceholderProps) {
  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium select-none print:hidden ${className}`}
      style={{ width, height }}
    >
      <div className="text-center">
        <p>{text}</p>
        <p className="text-xs opacity-70 mt-1">{width} x {height}</p>
      </div>
    </div>
  );
}
