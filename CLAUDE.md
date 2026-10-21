# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev`: Start the Vite frontend development server (port 5173).
- `node server.js`: Start the local Express backend server (port 3001).
- **Note**: For full local development, you should run both the backend and the frontend in separate terminals.

### Build & Production
- `npm run build`: Build the frontend for production.
- `npm run preview`: Preview the production build locally.

### Linting
- `npm run lint`: Run ESLint to check for code quality and style issues.

## Project Architecture

This is a professional portfolio web application built with **React** and **Vite**. It features a modern, responsive design with support for dark/light modes and internationalization (i18n).

### Tech Stack
- **Frontend**: React, Vite, React Router (navigation), i18next (internationalization), CSS Variables (theming).
- **Backend (Production)**: Vercel Serverless Functions interacting with a **Supabase** (PostgreSQL) database.
- **Backend (Development)**: A local **Node.js/Express** server (`server.js`) that simulates the production API and uses the local file system for data storage.

### Directory Structure
- `api/`: Vercel Serverless Functions used in production.
- `src/`: Main frontend source code.
  - `components/`: Reusable UI components.
  - `config/`: Global configuration and constants.
  - `context/`: React Context providers for state management (e.g., Theme).
  - `data/`: Static data and assets.
  - `hooks/`: Custom React hooks.
  - `i18n/`: Translation files and i18n configuration.
  - `pages/`: Main page components (views).
  - `styles/`: Global styles and theme definitions.
- `server.js`: Local backend server for development.
- `supabase_schema.sql`: Database schema for Supabase setup.
