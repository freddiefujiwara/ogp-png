# Image Creator App

This is a minimalist Vue 3 application built with Vite that allows users to create images from text using a Google Script API.

## Features

- Text input for image generation.
- Responsive dark mode design.
- Image download as PNG.
- GitHub Actions CI workflow.

## Tests Explanation

### Unit & Component Tests

Located in `src/__tests__/App.spec.js`:

1.  **Rendering Test**: Ensures the textarea and "Create" button are correctly displayed on initial load.
2.  **Loading State Test**: Verifies that the "Creating..." message appears and the button is disabled while the API call is in progress.
3.  **API Integration & Display Test**: Mocks the API response to confirm that the generated base64 image is correctly rendered in an `<img>` tag and the download button becomes available.
4.  **Validation Test**: Checks that the "Create" button is disabled when the input is empty or contains only whitespace.

## How to Run

1.  `npm install`
2.  `npm run dev` (development server)
3.  `npm run test` (run tests)
4.  `npm run build` (production build)
