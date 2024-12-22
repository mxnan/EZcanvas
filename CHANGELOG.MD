# Changelog

## [1.0.0] - 2023-12-23

### BETA

- **Initial Release**: Launched the application for public testing.
- **Core Features**:
  - **Background Removal**: Integrated automatic background removal for uploaded images.
  - **Text Customization**: Users can add multiple text overlays with customizable:
    - Font styles and sizes
    - Colors and opacity
    - Position and rotation
    - Animations
  - **Image Sources**: Support for local device uploads and Unsplash integration.
  - **Authentication**: Implemented secure Google OAuth via Supabase.
  - **Responsive Design**: Ensured compatibility across various devices.
  - **Dark/Light Mode**: Built-in theme support for user preferences.
- **Tech Stack**:
  - Built with **Next.js 15** and **React 18** (App Router).
  - Utilized **Tailwind CSS** for styling and **ShadCN UI** for components.
  - Integrated **Framer Motion** for animations.
  - Managed state with **Zustand**.
  - Employed **@imgly/background-removal** for image processing and **modern-gif** for GIF generation.
  - Deployed on **Vercel**.
- **Performance Optimizations**:
  - Implemented dynamic imports for heavy components.
  - Optimized images using Next.js Image component.
  - Enabled lazy loading for animations.
  - Utilized efficient state management with Zustand.

////////////////////////////////////////////////////////////////////
