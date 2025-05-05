# @l1network/ui

A comprehensive UI component library built with Tailwind CSS and shadcn/ui, providing a modern and accessible design system for L1Network applications.

## Features

- 🎨 Modern, accessible UI components
- 🎯 Built with Tailwind CSS and Radix UI primitives
- 🔧 Fully customizable with design tokens
- 📱 Responsive and mobile-first design
- 🌙 Dark mode support
- ♿️ ARIA-compliant accessibility
- 📦 Tree-shakeable components
- 🔒 Type-safe props with TypeScript

## Installation

```bash
pnpm add @l1network/ui
```

### Peer Dependencies

```bash
pnpm add tailwindcss @radix-ui/react-* class-variance-authority clsx tailwind-merge
```

## Setup

1. Add the UI package to your `tailwind.config.js`:

```js
module.exports = {
  presets: [require('@l1network/ui/tailwind')],
}
```

2. Import the styles in your app:

```tsx
import '@l1network/ui/styles.css'
```

## Usage

```tsx
import { Button, Input, Card } from '@l1network/ui'

function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Login</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input placeholder="Email" type="email" />
        <Button variant="primary">
          Submit
        </Button>
      </Card.Content>
    </Card>
  )
}
```

## Component Categories

### Layout
- Container
- Grid
- Stack
- Box
- Flex

### Forms
- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Textarea
- Form

### Data Display
- Card
- Table
- List
- Badge
- Avatar
- Icon

### Navigation
- Menu
- Tabs
- Breadcrumbs
- Pagination
- Link

### Feedback
- Alert
- Toast
- Progress
- Spinner
- Skeleton

### Overlay
- Dialog
- Drawer
- Popover
- Tooltip
- Sheet

## Best Practices

1. **Accessibility First**
   - Use semantic HTML elements
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain sufficient color contrast

2. **Responsive Design**
   - Follow mobile-first approach
   - Use responsive props
   - Test across viewports

3. **Performance**
   - Import only needed components
   - Utilize code-splitting
   - Optimize bundle size

4. **Theming**
   - Use design tokens
   - Follow color system
   - Maintain consistent spacing

## Contributing

Please refer to the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

MIT License


