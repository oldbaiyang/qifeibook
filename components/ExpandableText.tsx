"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export default function ExpandableText({
  text,
  maxLines = 4,
  className = "",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight) || 20;
      const maxHeight = lineHeight * maxLines;
      setNeedsExpand(textRef.current.scrollHeight > maxHeight + 10);
    }
  }, [text, maxLines]);

  return (
    <div className={`expandableText ${className}`}>
      <div
        ref={textRef}
        className={`expandableContent ${!expanded && needsExpand ? "collapsed" : ""}`}
        style={{
          "--max-lines": maxLines,
        } as React.CSSProperties}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
      {needsExpand && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="expandToggle"
        >
          {expanded ? (
            <>
              <span>收起</span>
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              <span>展开全部</span>
              <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
