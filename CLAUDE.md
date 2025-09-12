# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 application built with Vite, using the Composition API with `<script setup>` syntax. The project is a standard Vue 3 starter template with minimal dependencies.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint

# Run ESLint with automatic fixes
npm run lint:fix
```

## Project Structure

- `src/main.js` - Application entry point that mounts the Vue app
- `src/App.vue` - Root component using Composition API syntax
- `src/components/` - Vue components directory
  - `HelloWorld.vue` - Simple component with props
  - `TheWelcome.vue` - Welcome screen with multiple sections
  - `WelcomeItem.vue` - Reusable item component for the welcome screen
  - `icons/` - SVG icon components
- `src/assets/` - Static assets (CSS, images)
- `public/` - Public static files served directly

## Key Architecture Patterns

- **Composition API**: All components use `<script setup>` syntax
- **Single File Components**: Vue SFCs with template, script, and scoped styles
- **Path Aliases**: `@/` alias configured to point to `src/` directory
- **Component Props**: Props are defined using `defineProps()` with TypeScript-style validation
- **Scoped Styling**: Components use `<style scoped>` for isolated CSS

## Build System

- **Vite**: Modern build tool with fast HMR and ES modules
- **Vue DevTools**: Integrated via `vite-plugin-vue-devtools`
- **ESLint**: Code quality and style checking configured for Vue 3 and ES6+
- **Node Requirements**: Requires Node.js ^20.19.0 || >=22.12.0
- **Module Type**: ES modules (type: "module" in package.json)

## Development Notes

- Components are imported without file extensions (handled by Vite)
- Static assets in `src/assets/` are processed by Vite's asset handling
- The project uses Vue 3.5.18 with the latest Vite and Vue plugin versions
- ESLint is configured to run on save in VSCode with automatic fixes
- ESLint configuration is relaxed for Vue template formatting while maintaining code quality checks