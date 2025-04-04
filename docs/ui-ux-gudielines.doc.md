# 🎨 UI/UX Styling Guidelines for ABA App

## 1. Design System Overview

### Typography

| Element       | Font  | Weight         | Size            | Line Height |
| ------------- | ----- | -------------- | --------------- | ----------- |
| Headings (h1) | Inter | 700 (Bold)     | 2rem (32px)     | 1.2         |
| Headings (h2) | Inter | 600 (Semibold) | 1.5rem (24px)   | 1.3         |
| Headings (h3) | Inter | 600 (Semibold) | 1.25rem (20px)  | 1.4         |
| Body text     | Inter | 400 (Regular)  | 1rem (16px)     | 1.5         |
| Small text    | Inter | 400 (Regular)  | 0.875rem (14px) | 1.5         |
| Micro text    | Inter | 500 (Medium)   | 0.75rem (12px)  | 1.5         |

### Spacing

Follow a consistent 4px grid system:

- **4px (1)**: Minimal spacing
- **8px (2)**: Tight spacing between related elements
- **12px (3)**: Standard spacing within components
- **16px (4)**: Standard spacing between components
- **24px (6)**: Spacious separation
- **32px (8)**: Section separation
- **48px (12)**: Large section separation

Apply using Tailwind:

```
p-1, p-2, p-3, p-4, p-6, p-8, p-12
m-1, m-2, m-3, m-4, m-6, m-8, m-12
gap-1, gap-2, gap-3, gap-4, gap-6, gap-8, gap-12
```

### Border Radius

Use consistent rounding with a hierarchy of roundness:

- **2px (rounded-sm)**: Subtle rounding for small elements
- **4px (rounded)**: Default for most UI elements
- **8px (rounded-md)**: Medium-sized containers
- **12px (rounded-lg)**: Cards, panels, modals
- **16px (rounded-xl)**: Featured elements
- **24px (rounded-2xl)**: Highlight elements
- **Full (rounded-full)**: Avatars, badges, circular buttons

### Elevation (Shadows)

| Level | Usage              | Tailwind Class | Description                                 |
| ----- | ------------------ | -------------- | ------------------------------------------- |
| 0     | Flat elements      | shadow-none    | No shadow                                   |
| 1     | Subtle elevation   | shadow-sm      | Subtle depth for cards and containers       |
| 2     | Standard elevation | shadow         | Standard shadow for interactive elements    |
| 3     | Medium elevation   | shadow-md      | Popups, dropdowns, floating elements        |
| 4     | High elevation     | shadow-lg      | Modals, dialogs                             |
| 5     | Highest elevation  | shadow-xl      | Critical notifications, onboarding elements |

## 2. Color Palette

### Primary Colors

| Role          | Light Mode | Dark Mode | Usage                                    |
| ------------- | ---------- | --------- | ---------------------------------------- |
| Primary       | #3864FB    | #6789FF   | Main actions, buttons, links, highlights |
| Primary Dark  | #2649C8    | #4F6DD9   | Hover/active states for primary elements |
| Primary Light | #E0E8FF    | #394780   | Backgrounds, indicators, highlights      |

### Secondary Colors

| Role            | Light Mode | Dark Mode | Usage                                      |
| --------------- | ---------- | --------- | ------------------------------------------ |
| Secondary       | #64748B    | #94A3B8   | Supporting elements, secondary buttons     |
| Secondary Dark  | #475569    | #75849B   | Hover/active states for secondary elements |
| Secondary Light | #F1F5F9    | #334155   | Backgrounds, subtle indicators             |

### Neutral Palette

| Role           | Light Mode | Dark Mode | Usage                       |
| -------------- | ---------- | --------- | --------------------------- |
| Background     | #FFFFFF    | #121212   | Main page background        |
| Surface        | #F8FAFC    | #1E1E1E   | Cards, panels, containers   |
| Border         | #E2E8F0    | #334155   | Dividers, borders           |
| Text Primary   | #0F172A    | #F8FAFC   | Main text content           |
| Text Secondary | #64748B    | #94A3B8   | Secondary text, labels      |
| Text Muted     | #94A3B8    | #64748B   | Disabled text, placeholders |

### Alert Colors

| Type    | Light Mode | Dark Mode | Usage                           |
| ------- | ---------- | --------- | ------------------------------- |
| Success | #10B981    | #34D399   | Positive outcomes, completions  |
| Warning | #F59E0B    | #FBBF24   | Alerts, warnings, notifications |
| Error   | #EF4444    | #F87171   | Errors, destructive actions     |
| Info    | #3B82F6    | #60A5FA   | Informational elements, help    |

## 3. Component Styling

### Buttons

#### Primary Button

```
bg-primary text-primary-foreground hover:bg-primary/90
h-9 px-4 py-2 rounded-md font-medium text-sm
focus-visible:ring-ring/50 focus-visible:ring-[3px]
```

#### Secondary Button

```
bg-secondary text-secondary-foreground hover:bg-secondary/80
h-9 px-4 py-2 rounded-md font-medium text-sm
```

#### Ghost Button

```
hover:bg-accent hover:text-accent-foreground
h-9 px-4 py-2 rounded-md font-medium text-sm
```

#### Small Button

```
h-8 rounded-md gap-1.5 px-3 text-sm font-medium
```

#### Large Button

```
h-10 rounded-md px-6 text-sm font-medium
```

#### Icon Button

```
size-9 rounded-md inline-flex items-center justify-center
```

### Cards and Panels

```
bg-card text-card-foreground rounded-xl border shadow-sm p-6
flex flex-col gap-6
```

#### Card Header

```
grid auto-rows-min items-start gap-1.5 px-6
```

#### Card Content

```
px-6
```

#### Card Footer

```
flex items-center px-6 pt-6
```

### Modals and Overlays

```
bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out
fixed inset-0 z-50
```

#### Dialog Content

```
bg-background border shadow-lg rounded-lg
max-w-lg w-full p-6 gap-4 z-50
data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
```

### Form Elements

#### Input

```
flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
disabled:cursor-not-allowed disabled:opacity-50
```

#### Select

```
flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
disabled:cursor-not-allowed disabled:opacity-50
```

#### Checkbox

```
size-4 rounded border border-primary bg-transparent text-primary
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
disabled:cursor-not-allowed disabled:opacity-50
```

#### Toggle

```
inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
```

### Navigation

#### Sidebar

```
w-[280px] h-screen border-r bg-sidebar text-sidebar-foreground
```

#### Topbar

```
h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
```

## 4. Framer Motion Animations

### Page Transitions

```tsx
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Usage:
<motion.div
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={pageVariants}
>
  {children}
</motion.div>;
```

### Modal Animations

```tsx
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// Usage:
<motion.div
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={modalVariants}
>
  {modalContent}
</motion.div>;
```

### Button/Interaction Effects

```tsx
const buttonHoverProps = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15 },
};

// Usage:
<motion.button
  {...buttonHoverProps}
  className="bg-primary text-primary-foreground rounded-md px-4 py-2"
>
  Click Me
</motion.button>;
```

### Accordion/Expandable Content

```tsx
const accordionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
};

// Usage:
<motion.div
  initial="collapsed"
  animate={isOpen ? "expanded" : "collapsed"}
  variants={accordionVariants}
  className="overflow-hidden"
>
  {content}
</motion.div>;
```

### List Item Animations

```tsx
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// Usage:
<motion.ul initial="hidden" animate="visible" variants={listVariants}>
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>;
```

## 5. Dark Mode Support

The app will maintain a consistent visual hierarchy between light and dark modes while optimizing for readability and reducing eye strain in low-light environments.

### Dark Mode Implementation

- Use CSS variables for all colors with light/dark mode variants
- Color transformations should preserve visual hierarchy and meaning
- Reduce contrast slightly in dark mode (but maintain WCAG AA compliance)
- Use darker background colors with slight saturation

### Dark Mode Adjustments

- Background: Use dark grays with subtle blue tints (#121212, #1E1E1E)
- Decrease shadow intensity in dark mode
- Increase component contrast slightly with subtle borders
- Maintain consistent spacing and layout between modes

## 6. Responsive Guidelines

### Breakpoints

| Name | Width    | Tailwind Class | Description                 |
| ---- | -------- | -------------- | --------------------------- |
| xs   | < 640px  | max-sm         | Mobile phones               |
| sm   | ≥ 640px  | sm             | Large phones, small tablets |
| md   | ≥ 768px  | md             | Tablets, small laptops      |
| lg   | ≥ 1024px | lg             | Laptops, desktops           |
| xl   | ≥ 1280px | xl             | Large desktops              |
| 2xl  | ≥ 1536px | 2xl            | Extra large displays        |

### Mobile-First Approach

- Use the default styles for mobile view
- Add responsive variants using Tailwind's responsive prefixes
- Stack elements vertically on smaller screens
- Consider touch targets (min 44×44px) for all interactive elements
- Adjust font sizes to maintain readability across devices

### Example Responsive Component

```tsx
<div
  className="
  flex flex-col gap-4 p-4
  sm:flex-row sm:p-6 
  lg:gap-6 lg:p-8
"
>
  <div className="w-full sm:w-1/3">{/* Sidebar content */}</div>
  <div className="w-full sm:w-2/3">{/* Main content */}</div>
</div>
```

## 7. Implementation Plan

### Phase 1: Foundation Setup

1. Configure Tailwind with custom design tokens
2. Set up CSS variables for the color system
3. Implement dark mode toggle with theme context
4. Create base component styles

### Phase 2: Component Development

1. Build core components following the design system
2. Implement form elements with appropriate styling
3. Create navigation components (sidebar, topbar)
4. Add Framer Motion animation utilities

### Phase 3: Layout and Responsive Implementation

1. Develop page layouts and container components
2. Implement responsive breakpoints and adjustments
3. Test across various device sizes
4. Optimize for touch interfaces

### Phase 4: Refinement and Documentation

1. Perform accessibility audit and improvements
2. Optimize animations for performance
3. Create a comprehensive component library
4. Document usage patterns and examples

## 8. Usage Examples

The following examples demonstrate how to use the design system in practice:

### Button Group Example

```tsx
<div className="flex gap-2">
  <Button variant="default">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
</div>
```

### Card Example

```tsx
<Card>
  <CardHeader>
    <CardTitle>Client Session</CardTitle>
    <CardDescription>April 10, 2023</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Session notes and observations...</p>
  </CardContent>
  <CardFooter>
    <Button variant="default">Save</Button>
  </CardFooter>
</Card>
```

### Form Example

```tsx
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Client Name</Label>
    <Input id="name" placeholder="Enter client name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="session-type">Session Type</Label>
    <Select id="session-type">
      <option value="assessment">Assessment</option>
      <option value="therapy">Therapy</option>
      <option value="consultation">Consultation</option>
    </Select>
  </div>
  <Button type="submit">Submit</Button>
</form>
```

This documentation provides a comprehensive guide for implementing a cohesive design system for the ABA app, ensuring a professional, accessible, and user-friendly experience across all devices and modes.
