"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import { ThemeDropdown } from "@workspace/ui/components/theme-dropdown";

export interface ThemeSelectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of theme selector to use:
   * - "toggle": A switch toggle with sun/moon icons
   * - "dropdown": A dropdown menu with light/dark/system options
   * - "both": Both toggle and dropdown side by side
   */
  type?: "toggle" | "dropdown" | "both";

  /**
   * The position of the theme selector:
   * - "header": For header placement (horizontal layout)
   * - "sidebar": For sidebar placement (can be vertical)
   */
  position?: "header" | "sidebar";
}

export function ThemeSelector({
  className,
  type = "dropdown",
  position = "header",
  ...props
}: ThemeSelectorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        position === "sidebar" && "flex-col",
        className,
      )}
      {...props}
    >
      {(type === "toggle" || type === "both") && (
        <ThemeToggle
          align="horizontal"
          className={cn(type === "both" && "mr-2")}
        />
      )}
      {(type === "dropdown" || type === "both") && <ThemeDropdown />}
    </div>
  );
}

export { ThemeToggle, ThemeDropdown };
