# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server with Wrangler
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run lint` - Run TypeScript compiler for linting
- `pnpm run format` - Format code with Prettier
- `pnpm run deploy` - Deploy to Cloudflare Pages

## Database Commands

- `pnpm run db-gen` - Generate Drizzle migrations
- `pnpm run db-up` - Apply migrations to Cloudflare D1
- `pnpm run db-exec` - Execute SQL on Cloudflare D1 database

## Architecture Overview

This is a personal website/blog built with:

- **Frontend**: React 19 with React Router v7 (file-based routing)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Drizzle ORM with Cloudflare D1 (SQLite)
- **Platform**: Cloudflare Pages/Workers
- **Content**: Posts fetched from Notion API
- **Package Manager**: pnpm

### Key Architecture Patterns

- **Server-Side Rendering**: Uses React Router v7 with SSR enabled
- **File-based Routing**: Routes are defined in `app/routes/` directory
- **Database Schema**: Simple post table with id, title, content, slug, and tags
- **Auto-imports**: React hooks and components are auto-imported via unplugin-auto-import
- **Content Management**: Posts are managed in Notion and imported via scripts

### Important Files

- `app/routes.ts` - Route configuration using flat file routes
- `app/drizzle/schema.ts` - Database schema definitions
- `workers/app.ts` - Cloudflare Worker entry point
- `react-router.config.ts` - React Router configuration
- `vite.config.ts` - Vite build configuration with Cloudflare plugins

### Development Environment

- Requires Node.js >=20.0.0
- Uses pnpm as package manager
- Development server runs on React Router dev server
- Production uses Cloudflare Workers runtime

### Testing and Quality

- TypeScript for type safety
- Prettier for code formatting
- TypeScript compiler serves as linter
- No explicit test framework configured