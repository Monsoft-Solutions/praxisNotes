# PraxisNotes Color System

This document outlines the color system and styling guidelines for the PraxisNotes application. We use a combination of OKLCH colors (for better color perception and contrast) and Tailwind CSS for styling.

## Color Palette

### Primary Colors

| Role          | Light Mode (Hex) | Dark Mode (Hex) | Usage                                    |
| ------------- | ---------------- | --------------- | ---------------------------------------- |
| Primary       | #3864FB          | #6789FF         | Main actions, buttons, links, highlights |
| Primary Dark  | #2649C8          | #4F6DD9         | Hover/active states for primary elements |
| Primary Light | #E0E8FF          | #394780         | Backgrounds, indicators, highlights      |

### Secondary Colors

| Role            | Light Mode (Hex) | Dark Mode (Hex) | Usage                                      |
| --------------- | ---------------- | --------------- | ------------------------------------------ |
| Secondary       | #64748B          | #94A3B8         | Supporting elements, secondary buttons     |
| Secondary Dark  | #475569          | #75849B         | Hover/active states for secondary elements |
| Secondary Light | #F1F5F9          | #334155         | Backgrounds, subtle indicators             |

### Neutral Colors

| Role           | Light Mode (Hex) | Dark Mode (Hex) | Usage                       |
| -------------- | ---------------- | --------------- | --------------------------- |
| Background     | #FFFFFF          | #121212         | Main page background        |
| Surface/Card   | #F8FAFC          | #1E1E1E         | Cards, panels, containers   |
| Border         | #E2E8F0          | #334155         | Dividers, borders           |
| Text Primary   | #0F172A          | #F8FAFC         | Main text content           |
| Text Secondary | #64748B          | #94A3B8         | Secondary text, labels      |
| Text Muted     | #94A3B8          | #64748B         | Disabled text, placeholders |

### Alert Colors

| Type    | Light Mode (Hex) | Dark Mode (Hex) | Usage                           |
| ------- | ---------------- | --------------- | ------------------------------- |
| Success | #10B981          | #34D399         | Positive outcomes, completions  |
| Warning | #F59E0B          | #FBBF24         | Alerts, warnings, notifications |
| Error   | #EF4444          | #F87171         | Errors, destructive actions     |
| Info    | #3B82F6          | #60A5FA         | Informational elements, help    |

## Using Colors in Code

Colors are defined as CSS variables and exposed through Tailwind classes. Here's how to use them:

### Direct CSS Usage

```css
.custom-element {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

### Tailwind Usage

```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary-dark">
  Button Text
</button>

<div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
  Card content
</div>

<div className="bg-destructive text-destructive-foreground px-2 py-1 rounded">
  Error message
</div>

<div className="bg-success text-white px-2 py-1 rounded">
  Success message
</div>
```

## Theming Guidelines

1. **Consistency**: Use the color variables consistently across the application to maintain a cohesive visual language.

2. **Color Contrast**: Ensure that text has sufficient contrast against its background for accessibility (WCAG 2.1 AA compliance).

3. **Dark Mode**: The application supports both light and dark modes. Colors will automatically switch based on the user's preference.

4. **Hover/Focus States**: Use darker variants (`primary-dark`, `secondary-dark`) for hover and focus states.

5. **Background/Foreground Pairs**: Each background color has a corresponding foreground color. Always use them together to ensure readability.

## Shadow Usage

Use Tailwind's shadow utilities for consistent elevation:

- `shadow-sm`: Subtle elevation for cards and containers
- `shadow`: Standard shadow for interactive elements
- `shadow-md`: Popups, dropdowns, floating elements
- `shadow-lg`: Modals, dialogs
- `shadow-xl`: Critical notifications, onboarding elements

## Border Radius

Follow the consistent rounding system:

- `rounded-sm` (2px): Subtle rounding for small elements
- `rounded` (4px): Default for most UI elements
- `rounded-md` (8px): Medium-sized containers
- `rounded-lg` (12px): Cards, panels, modals
- `rounded-xl` (16px): Featured elements
- `rounded-2xl` (24px): Highlight elements
- `rounded-full`: Avatars, badges, circular buttons

## Spacing

Follow the consistent 4px grid system with Tailwind:

- `p-1`, `m-1`, `gap-1` (4px): Minimal spacing
- `p-2`, `m-2`, `gap-2` (8px): Tight spacing between related elements
- `p-3`, `m-3`, `gap-3` (12px): Standard spacing within components
- `p-4`, `m-4`, `gap-4` (16px): Standard spacing between components
- `p-6`, `m-6`, `gap-6` (24px): Spacious separation
- `p-8`, `m-8`, `gap-8` (32px): Section separation
- `p-12`, `m-12`, `gap-12` (48px): Large section separation
