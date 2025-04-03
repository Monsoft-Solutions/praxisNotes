"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Switch } from "@workspace/ui/components/switch";
import { cn } from "@workspace/ui/lib/utils";

interface ThemeToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "horizontal" | "vertical";
}

export function ThemeToggle({
  className,
  align = "horizontal",
  ...props
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "animate-pulse opacity-70",
          align === "horizontal"
            ? "flex items-center gap-2"
            : "flex flex-col items-center gap-1",
          className,
        )}
        {...props}
      >
        <div className="size-4 rounded-full bg-muted" />
        <div className="h-[1.15rem] w-8 rounded-full bg-muted" />
        <div className="size-4 rounded-full bg-muted" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        align === "horizontal"
          ? "flex items-center gap-2"
          : "flex flex-col items-center gap-1",
        className,
      )}
      {...props}
    >
      <Sun
        className={cn(
          "size-4 transition-opacity",
          theme === "dark" ? "opacity-50" : "opacity-100",
        )}
      />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon
        className={cn(
          "size-4 transition-opacity",
          theme === "light" ? "opacity-50" : "opacity-100",
        )}
      />
    </div>
  );
}
