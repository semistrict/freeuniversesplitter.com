# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Free Universe Splitter is a quantum decision-making web application built on the Many Worlds interpretation of quantum mechanics. It uses true quantum randomness from four international sources (ANU, NIST CURBy, INMETRO, LfD) to help users make decisions by "splitting the universe" between alternatives.

## Architecture

The project consists of four main components:

1. **Main Web App** (`/`) - SvelteKit + TypeScript frontend with retro CRT terminal styling
2. **API Server** (`/fus_api/`) - Cloudflare Workers backend aggregating quantum randomness from multiple sources
3. **MCP Server** (`/fus_mcp/`) - Model Context Protocol server providing quantum tools for Claude integration
4. **iOS App** (`/ios/`) - Native iOS/watchOS companion app (incomplete)

## Development Commands

### Main Application

```bash
npm run dev              # Start development server
npm run build           # Production build
npm run test            # Run Playwright e2e tests
npm run lint            # ESLint + Prettier check
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format code with Prettier
```

### API Server (`fus_api/`)

```bash
npm run start           # Start Wrangler dev server
npm run deploy          # Deploy to Cloudflare Workers
```

### MCP Server (`fus_mcp/`)

```bash
npm run dev             # Start Wrangler dev server
npm run deploy          # Deploy to Cloudflare Workers
npm run format          # Biome formatting
npm run lint:fix        # Biome linting
```

## Key Technical Patterns

### Quantum Randomness Integration

The core architecture revolves around aggregating quantum randomness from multiple sources for maximum entropy. The API server (`fus_api/`) handles the complex logic of fetching, combining, and caching quantum data from:

- Australian National University (quantum vacuum fluctuations)
- NIST CURBy Beacon (quantum entanglement)
- Brazilian INMETRO Beacon (cryptographically signed quantum pulses)
- German LfD Laboratory (ID Quantique hardware)

### State Management

The application uses URL-based state sharing for results rather than client-side storage. Decision outcomes are encoded in URL parameters to enable sharing while maintaining the privacy-first approach (no server-side data storage).

### Visual Design System

The entire UI follows a retro CRT terminal aesthetic with:

- "Less Perfect DOS VGA" font family
- Green text on black background with scanline effects
- Component-based styling in Svelte with consistent theming
- Mobile-first responsive design with PWA manifest

### Serverless Architecture

All backend services run on Cloudflare Workers with:

- KV namespace for quantum randomness caching
- itty-router for HTTP request handling
- Zero cold-start latency for quantum API responses

## Component Organization

### Frontend (`src/lib/`)

- `components/` - Reusable UI components following the CRT theme
- `stores/` - Svelte stores for application state
- `utils/` - Utility functions for quantum calculations and formatting
- Key files like `ichingLib.js` contain complex hexagram generation logic

### Quantum API Integration

The main app connects to the quantum API through well-defined endpoints that abstract the complexity of multiple quantum sources. The MCP server provides the same quantum tools for Claude integration.

## Development Notes

- Always use TypeScript - all components are strictly typed
- Follow the established CRT terminal aesthetic for any UI changes
- The quantum randomness system is the core differentiator - maintain the multi-source approach
- No user data collection or storage - maintain privacy-first architecture
- Testing uses Playwright for e2e coverage of the decision-making flows
