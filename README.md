# @patdx/site

My personal website built with React, Remix, and deployed on Cloudflare Pages.

Posts are maintained in Notion and fetched using the Notion API.

## Prerequisites

- Node.js >=20.0.0
- pnpm

## Installation

Clone the repository and install dependencies:

git clone <repository-url> cd @patdx/site pnpm install

## Development

Set the NOTION_TOKEN environment variable with your Notion API token.

To run the development server:

pnpm run dev

## Deployment

- build: Build the project for production
- deploy: Deploy to Cloudflare Pages

## Database Management

This project uses Drizzle ORM with Cloudflare D1. To manage your database:

1. Generate migrations: pnpm run db-gen
2. Apply migrations: pnpm run db-up
3. Execute SQL: pnpm run db-exec

## Deployment

To deploy the website to Cloudflare Pages:

pnpm run build pnpm run deploy

## Development Dependencies

- @biomejs/biome for linting and formatting
- vite as the build tool
- wrangler for Cloudflare Workers CLI

## Contributing

This is a personal website, but if you notice any issues or have suggestions, feel free to open an issue or submit a pull request.
