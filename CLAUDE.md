# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom Keycloak authentication theme built with React 19, TypeScript, and Keycloakify. It produces JAR files deployable to Keycloak servers. The theme covers 38 login/auth page flows with a modern UI using shadcn/ui components and Tailwind CSS 4.

## Commands

- `pnpm dev` — Start Vite dev server with HMR
- `pnpm build` — TypeScript check + Vite production build
- `pnpm build-keycloak-theme` — Build deployable Keycloak JAR files (requires Maven 3.1.1+ and Java 7+)
- `pnpm storybook` — Start Storybook on port 6006 (every page has a `.stories.tsx` file)
- `pnpm format` — Run Prettier formatting
- `pnpm lint` — Run ESLint

## Architecture

### Page Routing

[KcPage.tsx](src/login/KcPage.tsx) is the central router. It switches on `kcContext.pageId` and lazy-loads the corresponding page component from `src/login/pages/`. Every page receives `kcContext`, `i18n`, and `classes` props.

### Template System

[Template.tsx](src/login/Template.tsx) wraps all pages with a ThemeProvider (dark mode via `next-themes`) and the custom `AuthPageLayout`. Page-specific content is rendered inside this shell.

### Component Layers

- **`src/components/ui/`** — shadcn/ui components (Button, Card, Input, etc.) built on Radix UI primitives. Barrel-exported from `index.ts`. Configured in `components.json` (style: "new-york", icons: Lucide).
- **`src/components/overrides/`** — Custom components that replace or extend Keycloakify defaults (auth layout, social providers, locale switch, theme toggle, password input).
- **`src/login/pages/`** — One component per Keycloak auth flow (Login, Register, LoginOtp, WebauthnAuthenticate, etc.) with co-located Storybook stories.

### Import Alias

`@/*` resolves to `./src/*` (configured in both tsconfig.json and vite.config.ts).

### Utility

`cn()` from [src/lib/utils.ts](src/lib/utils.ts) merges Tailwind classes via `clsx` + `tailwind-merge`.

### Styling

Global styles in [src/login/global.css](src/login/global.css) and [src/login/custom.css](src/login/custom.css). Tailwind CSS 4 with CSS variables for theming. Prettier uses 90-char width by default, 150 for files in `pages/` and `Template` patterns.

### Internationalization

[src/login/i18n.ts](src/login/i18n.ts) configures Keycloakify's i18n system. Use the `msgStr()` and `msg()` helpers from the `i18n` prop for translated strings.

## Prerequisites

- Node.js ^18.0.0 || >=20.0.0
- pnpm 8.15.2+
- Maven 3.1.1+ and Java 7+ (for JAR builds only)

## Adding a New Login Page

1. Create the page component in `src/login/pages/`
2. Create a co-located `.stories.tsx` file using `KcPageStory` from [src/login/KcPageStory.tsx](src/login/KcPageStory.tsx)
3. Register it in [KcPage.tsx](src/login/KcPage.tsx) with a lazy import and case in the switch
4. Add the page ID to [KcContext.ts](src/login/KcContext.ts) if not already present
