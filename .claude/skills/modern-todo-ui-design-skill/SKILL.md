---
name: modern-todo-ui-design-skill
description: This skill should be used when creating modern, unique, and polished UI designs for todo management applications that integrate seamlessly with shadcn/ui components via the shadcn MCP server and follow best design principles.
---

# Modern Todo UI Design Skill

Create contemporary, polished UI designs for todo management applications that leverage shadcn/ui components and follow modern design principles.

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing structure, design patterns, Tailwind conventions, current UI components |
| **Conversation** | User's specific requirements, target audience, design preferences, brand guidelines |
| **Skill References** | Design principles, shadcn component patterns, accessibility guidelines, responsive design patterns |
| **User Guidelines** | Project-specific conventions, team standards, existing design system |

Ensure all required context is gathered before implementing.
Only ask user for THEIR specific requirements (domain expertise is in this skill).

## Core Capabilities

### Design Contemporary Todo Interfaces
- Create unique visual treatments for todo applications
- Implement modern UI patterns for task management
- Design intuitive UX flows for todo CRUD operations
- Apply current design trends (glassmorphism, neumorphism, etc.)

### shadcn MCP Server Integration
- Connect to shadcn MCP server to browse available components
- Query shadcn MCP server for component props and usage examples
- Leverage shadcn's pre-built accessible components as foundation
- Customize shadcn components with Tailwind classes and variants

### Component Implementation
- Button, Card, Dialog, Input, Dropdown, Sheet, Toast components
- Task-specific components (TaskItem, TaskList, TaskForm, Filters)
- Dashboard widgets and statistics cards
- Responsive navigation and layout components

## Design Principles to Follow

### Visual Hierarchy and Information Architecture
- Clear typography hierarchy with appropriate font weights
- Strategic use of color to guide user attention
- Proper spacing and alignment using design tokens
- Logical grouping of related elements

### Consistent Spacing and Alignment
- Use consistent spacing tokens (0.5rem, 1rem, 1.5rem, 2rem, etc.)
- Maintain vertical rhythm throughout the interface
- Align elements to grid systems
- Apply consistent padding and margins to components

### Thoughtful Color Palettes
- Ensure proper contrast ratios (WCAG AA compliance minimum)
- Use color meaningfully for status indicators and actions
- Apply accent colors strategically for emphasis
- Consider dark mode color schemes

### Modern Typography
- Use appropriate font weights and sizes for hierarchy
- Apply consistent line heights and letter spacing
- Ensure readability across all screen sizes
- Consider variable fonts for performance and flexibility

### Purposeful Animations
- Implement micro-interactions that enhance UX (not distract)
- Use subtle hover and focus states
- Apply smooth transitions for state changes
- Follow accessibility guidelines for motion preferences

### Mobile-First Responsive Design
- Design for mobile screens first, then enhance for larger screens
- Ensure touch targets are appropriately sized (44px minimum)
- Adapt layouts for different screen sizes
- Optimize performance across all devices

### Accessibility (WCAG Compliance)
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigability
- Support screen readers and other assistive technologies

## Implementation Workflow

### 1. Analyze Requirements
- Determine target audience and use case
- Identify key functionality requirements
- Review existing design system or brand guidelines
- Assess technical constraints and platform requirements

### 2. Plan Component Architecture
- Select appropriate shadcn/ui components for the design
- Plan responsive breakpoints and layouts
- Design component hierarchies and relationships
- Consider state management and data flow

### 3. Create Visual Design
- Establish color palette and typography system
- Design component variants and states
- Plan spacing and layout systems
- Create visual hierarchy and information architecture

### 4. Implement Components
- Use shadcn MCP server to access components
- Apply Tailwind classes for custom styling
- Implement responsive design patterns
- Ensure accessibility compliance

### 5. Test and Iterate
- Validate responsive behavior across devices
- Test accessibility features
- Gather feedback on UX flow
- Refine animations and micro-interactions

## Component Patterns

### Task Item Component
- Status indicator (complete/incomplete)
- Priority badge (high/medium/low)
- Due date display
- Quick action buttons (edit, delete, complete)
- Expandable details section

### Task List Component
- Filtering controls (all, active, completed)
- Sorting options (priority, due date, created date)
- Empty state handling
- Infinite scrolling or pagination

### Dashboard Cards
- Statistics counters (total, completed, pending)
- Progress indicators
- Quick action buttons
- Trend visualization

### Form Components
- Input validation and error states
- Multi-step forms for complex tasks
- Smart defaults and auto-fill
- Success and error feedback

## Modern Design Techniques

### Glassmorphism Effects
- Apply backdrop-filter for frosted glass effects
- Use appropriate background opacity
- Maintain sufficient contrast for readability
- Apply selectively for visual interest

### Neumorphism (Soft UI)
- Use subtle shadows for soft 3D effects
- Maintain adequate contrast for accessibility
- Apply sparingly to highlight important elements
- Ensure proper readability

### Micro-interactions
- Hover states with smooth transitions
- Loading animations for data operations
- Success/failure feedback animations
- Interactive elements with visual feedback

## shadcn Component Integration

### Query MCP Server for Components
```
Use shadcn MCP tools to:
- Browse available components
- Check component props and variants
- Get usage examples
- Verify accessibility features
```

### Customize Components
- Extend shadcn components with Tailwind classes
- Create variant styles for specific use cases
- Implement custom animations and transitions
- Ensure consistent design language across components

### Accessibility Implementation
- Preserve shadcn's built-in accessibility features
- Add custom ARIA labels when needed
- Ensure keyboard navigation works properly
- Test with screen readers and other assistive technologies

## Quality Standards

### Visual Consistency
- Maintain consistent spacing, typography, and color usage
- Apply design tokens consistently across components
- Ensure visual hierarchy supports user goals
- Test designs across different screen sizes

### Performance Optimization
- Optimize images and assets
- Implement efficient rendering patterns
- Use lazy loading for off-screen content
- Minimize bundle size with proper imports

### Code Quality
- Write clean, maintainable code
- Use descriptive class names and component names
- Follow established conventions
- Include appropriate comments and documentation

## Testing Guidelines

### Responsive Design Testing
- Test on mobile, tablet, and desktop screens
- Verify touch target sizes
- Ensure text remains readable at all sizes
- Validate layout behavior across breakpoints

### Accessibility Testing
- Verify keyboard navigation
- Test with screen readers
- Check color contrast ratios
- Validate ARIA attributes and roles

### Cross-Browser Testing
- Test in major browsers (Chrome, Firefox, Safari, Edge)
- Verify component behavior consistency
- Check for browser-specific issues
- Validate CSS feature support