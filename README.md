<!-- This file describes the project purpose, folder structure, and the next development steps. -->
<!-- It should be expanded later with setup instructions, architecture decisions, and deployment notes. -->

# Holiday Wishlist Web App

This repository contains the basic skeleton of a diploma project web application for creating and managing holiday wishlists.

## Goal

The app will allow users to:

- create accounts and manage profiles
- create and manage wishlists
- manage gifts inside wishlists
- control visibility for authors and guests
- split expensive gifts between multiple participants
- filter gifts
- export wishlists to PDF
- integrate events with Google Calendar
- switch business logic through a holiday scenario mode

## Stack

- Nuxt 4
- Vue 3
- TypeScript
- Supabase
- Nitro server routes

## Main Structure

- `assets/` shared styles and static design resources used by Nuxt build tools
- `components/` reusable UI blocks grouped by feature
- `composables/` shared Vue composition logic for auth, profile, wishlists, gifts, and realtime features
- `layouts/` page shells for regular pages and auth pages
- `middleware/` route guards for auth and guest-only flows
- `pages/` application routes and top-level views
- `plugins/` app plugins such as Supabase client setup
- `public/` public static files served as-is
- `server/` Nitro API route stubs for backend features
- `types/` domain and API TypeScript types
- `utils/` simple shared constants, helpers, and scenario rule placeholders

## Next Steps

1. Install dependencies and run the Nuxt app locally.
2. Connect Supabase authentication and profile storage.
3. Replace placeholder composables with real data flows.
4. Implement wishlist, gift, privacy, and scenario logic step by step.
5. Add PDF export and Google Calendar integration when the core flows are stable.
