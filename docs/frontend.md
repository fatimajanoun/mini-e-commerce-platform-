# Frontend Documentation

The frontend is built with React and TypeScript, with a focus on keeping the code reusable and easy to maintain.

# Component-Based Architecture

I divided the UI into reusable components instead of building each page separately. Common elements such as product cards, buttons, layouts, and inputs can be reused across the application.

# Lazy Loading

I use lazy loading for pages so that they are loaded only when needed. I added this to the products listing page.

# Global CSS

A global CSS file contains shared variables, colors, typography, spacing, and common styles. This keeps the design consistent across the application.

# App.tsx

`App.tsx` handles the main application structure and routing, while the actual page and component logic stays separated.

# Services

API calls are kept in  service files  rather than directly inside components. This  makes backend communication easier to reuse and maintain.

