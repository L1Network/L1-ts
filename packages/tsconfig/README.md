# @l1network/tsconfig

This package contains shared TypeScript configurations used across the L1Network UI monorepo.

## Available Configurations

### reset.json
The most basic configuration that includes [@total-typescript/ts-reset](https://github.com/total-typescript/ts-reset) for improved TypeScript types. This serves as the foundation for all other configurations.

### base.json
The base TypeScript configuration that all other configs extend from. It includes:
- ES2022 target
- Strict type checking enabled
- Module interoperability settings
- Common compiler options
- Type safety features
- Source map generation

### node.json
Configuration for Node.js projects. Extends base.json and adds:
- Node-specific module resolution (NodeNext)
- Build output settings
- Node.js specific compiler options
- Source directory configuration

### nextjs.json
Configuration for Next.js applications. Extends base.json and adds:
- Next.js specific plugin
- ESNext module system
- Bundler module resolution
- JSX support
- No emit (Next.js handles compilation)

### react-library.json
Configuration for React library packages. Extends base.json and adds:
- React JSX support
- Declaration file generation
- Module resolution settings

## Usage

Reference these configs in your `tsconfig.json`:

```json
{
  "extends": "@l1network/tsconfig/base.json"
}
```

For specific project types:

```json
{
  "extends": "@l1network/tsconfig/node.json"  // For Node.js projects
}
```

```json
{
  "extends": "@l1network/tsconfig/nextjs.json"  // For Next.js projects
}
```

```json
{
  "extends": "@l1network/tsconfig/react-library.json"  // For React libraries
}
```

## Contributing

Please refer to the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

MIT License
