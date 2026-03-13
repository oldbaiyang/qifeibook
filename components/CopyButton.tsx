"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copyButton ${className}`}
      title={copied ? "已复制" : "复制"}
    >
      {copied ? (
        <>
          <Check size={14} />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>复制</span>
        </>
      )}
    </button>
  );
}
