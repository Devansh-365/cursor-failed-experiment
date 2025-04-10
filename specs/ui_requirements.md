# UI Requirements Document

## Design Philosophy
The UI for our credit card reward optimization waitlist will follow a minimalist, Apple-inspired aesthetic. We emphasize clean lines, generous whitespace, subtle animations, and focused content to create an elegant, premium experience that resonates with our target audience.

## Color Palette

### Primary Colors
- **White (#ffffff)**: Primary background color
- **Near Black (#121212)**: Primary text color
- **Light Gray (#f5f5f7)**: Secondary background color

### Accent Colors
- **Purple Gradient**: 
  - Primary: `from-purple-600 to-indigo-700` 
  - Alternative: `from-violet-500 to-purple-800`
  - Used for CTAs, accent elements, and abstract blob decorations

### Typography
- **Font Family**: Inter (primary), with system-ui as fallback
- **Font Weights**:
  - Regular (400): Body text
  - Medium (500): Subheadings
  - Semibold (600): Headings, important UI elements
- **Font Sizes**:
  - Heading: 2.5rem (40px)
  - Subheading: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small text: 0.875rem (14px)

## Components

### Using shadcn/ui
We will leverage the shadcn/ui component library for consistent, accessible UI elements:

- **Button**: For the primary CTA to join waitlist
  - Primary variant: Purple gradient background, white text
  - Secondary variant: White background, black text with purple hover state
  
- **Input**: For email collection
  - Clean, minimal styling with subtle focus states
  - Inline validation

- **Toast**: For success/error notifications
  - Minimal design with subtle animations
  - Clear messaging with appropriate icons

- **Card**: For content sections
  - Subtle shadows and rounded corners
  - Clean white background

### Custom Elements

- **Gradient Blobs**: Abstract, organic shapes using the purple gradient
  - Positioned strategically in background
  - Low opacity (15-25%) for subtle effect
  - Gentle animation for visual interest

- **Hero Section**:
  - Minimal, impactful headline
  - Brief, compelling subheading
  - Clean visual hierarchy

## Layout Guidelines

- **Whitespace**: Generous padding and margins throughout
  - Section padding: 4rem (64px) vertical
  - Component spacing: 1.5rem (24px) minimum
  
- **Container Width**:
  - Max width: 1200px
  - Centered in viewport

- **Responsive Behavior**:
  - Mobile-first approach
  - Streamlined layout on smaller devices
  - Adjusted spacing on mobile (reduced by ~30%)

## Animation & Interaction

- **Subtle Animations**:
  - Gradient blob slow, gentle movement
  - Micro-interactions on hover/focus states
  - Smooth transitions (300-400ms duration)
  
- **Feedback**:
  - Visual feedback on all interactive elements
  - Success/error states with appropriate styling

## Accessibility

- Maintain WCAG 2.1 AA compliance
- Ensure sufficient color contrast (minimum 4.5:1 ratio)
- Provide focus indicators for keyboard navigation
- Include appropriate ARIA attributes

## Implementation Notes

### Tailwind Configuration
- Extend theme with custom colors
- Configure custom font settings
- Set up animation utilities

```js
// tailwind.config.js example
module.exports = {
  theme: {
    extend: {
      colors: {
        'near-black': '#121212',
        'light-gray': '#f5f5f7',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Shadcn Integration
- Install and configure required components
- Apply custom theme variables to match our design system

## Example Components

```jsx
// Example of primary button with purple gradient
<Button className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:opacity-90 transition-opacity">
  Join Waitlist
</Button>

// Example of a gradient blob
<div className="absolute -z-10 top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-r from-violet-500 to-purple-800 opacity-20 blur-3xl animate-blob"></div>
```

## Prototyping & Validation
- Create low-fidelity wireframes for layout validation
- Develop high-fidelity mockups for visual design approval
- Build interactive prototype for user flow testing 