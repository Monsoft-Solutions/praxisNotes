"use client";

import { X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface TagProps {
  text: string;
  onRemove: () => void;
  className?: string;
}

export function Tag({ text, onRemove, className }: TagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm",
        className,
      )}
    >
      <span>{text}</span>
      <button
        type="button"
        onClick={onRemove}
        className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center"
        aria-label={`Remove ${text}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
