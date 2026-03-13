"use client";

import { Cloud, ExternalLink } from "lucide-react";
import { useState } from "react";

interface DownloadCardProps {
  name: string;
  url: string;
  code?: string;
  format: string;
  size: string;
}

export default function DownloadCard({
  name,
  url,
  code,
  format,
  size,
}: DownloadCardProps) {
  const [copied, setCopied] = useState(false);
  const isQuark = name.includes("夸克");
  const providerClass = isQuark ? "quark" : "baidu";

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className={`downloadCard ${providerClass}`}>
      <div className="downloadCardLeft">
        <div className="downloadCardIcon">
          <Cloud size={24} />
        </div>
        <div className="downloadCardInfo">
          <h3>{name}</h3>
          <span>
            {format} · {size}
          </span>
        </div>
      </div>
      <div className="downloadCardRight">
        {code && (
          <div className="codeTag">
            <span>提取码:</span>
            <span className="code">{code}</span>
            <button className="copyBtn" onClick={handleCopy}>
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="downloadBtn"
        >
          <span>前往下载</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
