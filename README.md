# OGP Image Creator

This is a minimalist Vue 3 application built with Vite that allows users to create OGP (Open Graph Protocol) images from text using a Google Script API.

## Features

- Text input for OGP image generation.
- Responsive dark mode design.
- Image download as PNG.
- GitHub Actions CI workflow.

## Tests Explanation

### Unit & Component Tests

The project aims for 100% test coverage using Vitest and @vue/test-utils.

1.  **Component Tests**: Each component is tested for proper rendering and interaction.
2.  **Composables & Services**: Logic for API calls and state management is tested in isolation, including success and error scenarios.
3.  **Integration Tests**: `App.vue` is tested to ensure all components work together correctly.

## How to Run

1.  `npm install`
2.  `npm run dev` (development server)
3.  `npm run test` (run tests)
4.  `npm run build` (production build)
