# L1Network Documentation Site

This documentation site is built with Next.js and provides comprehensive documentation for L1Network's UI components, design system, and development guidelines.

## Features

- Interactive component documentation
- Live code examples and playgrounds
- Design system guidelines
- API references
- Development guides
- Search functionality
- Dark/light mode support

## Tech Stack

- [Next.js](https://nextjs.org) 14
- [shadcn/ui](https://ui.shadcn.com) components
- [Contentlayer](https://contentlayer.dev) for MDX content
- [Nextra](https://nextra.site) theme
- [Tailwind CSS](https://tailwindcss.com) for styling

## Development

### Requirements
- Node.js 20+
- pnpm

### Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

The development server will start at [http://localhost:3000](http://localhost:3000).

### Project Structure

```
docs/
├── content/           # Documentation content in MDX
│   ├── components/    # Component documentation
│   ├── guides/        # Development guides
│   └── api/          # API documentation
├── components/        # Documentation-specific components
├── theme.config.js    # Nextra theme configuration
└── styles/           # Custom styles
```

## Contributing

Please refer to the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

MIT License
