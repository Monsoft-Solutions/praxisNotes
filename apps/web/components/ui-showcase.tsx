"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";

type ColorItem = {
  name: string;
  variable: string;
  color: string;
};

const UIShowcase = () => {
  const primaryColors: ColorItem[] = [
    { name: "Primary", variable: "--primary", color: "bg-primary" },
    {
      name: "Primary Dark",
      variable: "--primary-dark",
      color: "bg-primary-dark",
    },
    {
      name: "Primary Light",
      variable: "--primary-light",
      color: "bg-primary-light",
    },
  ];

  const secondaryColors: ColorItem[] = [
    { name: "Secondary", variable: "--secondary", color: "bg-secondary" },
    {
      name: "Secondary Dark",
      variable: "--secondary-dark",
      color: "bg-secondary-dark",
    },
    {
      name: "Secondary Light",
      variable: "--secondary-light",
      color: "bg-secondary-light",
    },
  ];

  const neutralColors: ColorItem[] = [
    { name: "Background", variable: "--background", color: "bg-background" },
    { name: "Foreground", variable: "--foreground", color: "bg-foreground" },
    { name: "Card", variable: "--card", color: "bg-card" },
    {
      name: "Card Foreground",
      variable: "--card-foreground",
      color: "bg-card-foreground",
    },
    { name: "Border", variable: "--border", color: "bg-border" },
    { name: "Muted", variable: "--muted", color: "bg-muted" },
    {
      name: "Muted Foreground",
      variable: "--muted-foreground",
      color: "bg-muted-foreground",
    },
  ];

  const alertColors: ColorItem[] = [
    { name: "Destructive", variable: "--destructive", color: "bg-destructive" },
    { name: "Success", variable: "--success", color: "bg-success" },
    { name: "Warning", variable: "--warning", color: "bg-warning" },
    { name: "Info", variable: "--info", color: "bg-info" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">UI Style Showcase</h1>
        <ThemeSwitcher />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Color System</h2>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Primary Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {primaryColors.map((item) => (
              <ColorSwatch key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Secondary Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {secondaryColors.map((item) => (
              <ColorSwatch key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Neutral Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {neutralColors.map((item) => (
              <ColorSwatch key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Alert Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {alertColors.map((item) => (
              <ColorSwatch key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="bg-primary text-primary-foreground hover:bg-primary-dark h-9 px-4 py-2 rounded-md font-medium text-sm">
            Primary Button
          </button>
          <button className="bg-secondary text-secondary-foreground hover:bg-secondary-dark h-9 px-4 py-2 rounded-md font-medium text-sm">
            Secondary Button
          </button>
          <button className="bg-transparent border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md font-medium text-sm">
            Ghost Button
          </button>
          <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2 rounded-md font-medium text-sm">
            Destructive Button
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary-dark h-8 rounded-md gap-1.5 px-3 text-sm font-medium">
            Small Button
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary-dark h-9 px-4 py-2 rounded-md font-medium text-sm">
            Default Button
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary-dark h-10 rounded-md px-6 text-sm font-medium">
            Large Button
          </button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 flex flex-col gap-4">
            <div className="grid auto-rows-min items-start gap-1.5">
              <h3 className="text-lg font-semibold">Card Title</h3>
              <p className="text-sm text-muted-foreground">
                Card subtitle or description
              </p>
            </div>
            <div>
              <p>
                This is the main content of the card. It can contain various
                elements and components.
              </p>
            </div>
            <div className="flex items-center pt-4">
              <button className="bg-primary text-primary-foreground hover:bg-primary-dark h-9 px-4 py-2 rounded-md font-medium text-sm ml-auto">
                Action
              </button>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-xl border shadow-md p-6 flex flex-col gap-4">
            <div className="grid auto-rows-min items-start gap-1.5">
              <h3 className="text-lg font-semibold">Elevated Card</h3>
              <p className="text-sm text-muted-foreground">
                With medium shadow
              </p>
            </div>
            <div>
              <p>
                This card has a more prominent shadow to demonstrate elevation
                differences.
              </p>
            </div>
            <div className="flex items-center pt-4">
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary-dark h-9 px-4 py-2 rounded-md font-medium text-sm ml-auto">
                Secondary Action
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-destructive/15 text-destructive border border-destructive/30 px-4 py-3 rounded-lg flex items-start">
            <span className="font-medium">Error:</span>
            <span className="ml-2">
              This is an error message with important information.
            </span>
          </div>

          <div className="bg-warning/15 text-warning-foreground border border-warning/30 px-4 py-3 rounded-lg flex items-start">
            <span className="font-medium">Warning:</span>
            <span className="ml-2">
              This is a warning message that requires attention.
            </span>
          </div>

          <div className="bg-success/15 text-success border border-success/30 px-4 py-3 rounded-lg flex items-start">
            <span className="font-medium">Success:</span>
            <span className="ml-2">Operation completed successfully.</span>
          </div>

          <div className="bg-info/15 text-info border border-info/30 px-4 py-3 rounded-lg flex items-start">
            <span className="font-medium">Information:</span>
            <span className="ml-2">
              This is an informative message with helpful details.
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Heading 1 (2rem/32px)
            </h1>
            <p className="text-sm text-muted-foreground">
              Font: Inter, Weight: 700, Line Height: 1.2
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold leading-snug">
              Heading 2 (1.5rem/24px)
            </h2>
            <p className="text-sm text-muted-foreground">
              Font: Inter, Weight: 600, Line Height: 1.3
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold leading-snug">
              Heading 3 (1.25rem/20px)
            </h3>
            <p className="text-sm text-muted-foreground">
              Font: Inter, Weight: 600, Line Height: 1.4
            </p>
          </div>

          <div>
            <p className="text-base leading-normal">
              Body Text (1rem/16px): This is the standard body text used for
              most content in the application. It should be easy to read and
              have sufficient contrast with the background.
            </p>
            <p className="text-sm text-muted-foreground">
              Font: Inter, Weight: 400, Line Height: 1.5
            </p>
          </div>

          <div>
            <p className="text-sm leading-normal">
              Small Text (0.875rem/14px): Used for secondary information,
              metadata, or less important content.
            </p>
            <p className="text-sm text-muted-foreground">
              Font: Inter, Weight: 400, Line Height: 1.5
            </p>
          </div>

          <div>
            <p className="text-xs font-medium leading-normal">
              Micro Text (0.75rem/12px): Used for very fine details, footer
              information, or legal text.
            </p>
            <p className="text-sm text-muted-foreground">
              Font: Inter, Weight: 500, Line Height: 1.5
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ColorSwatch = ({ item }: { item: ColorItem }) => {
  const textColor =
    item.color === "bg-background" ||
    item.color === "bg-card" ||
    item.color === "bg-muted" ||
    item.color === "bg-primary-light" ||
    item.color === "bg-secondary-light"
      ? "text-foreground"
      : "text-white";

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div
        className={cn(
          item.color,
          "h-20 w-full flex items-center justify-center",
          textColor,
        )}
      >
        {item.name}
      </div>
      <div className="p-3 bg-card text-card-foreground">
        <div className="font-mono text-xs">{item.variable}</div>
        <div className="font-mono text-xs text-muted-foreground">
          var({item.variable})
        </div>
      </div>
    </div>
  );
};

export default UIShowcase;
