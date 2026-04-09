# IDE Project

A browser-based coding playground built with Next.js, NextAuth, Prisma (MongoDB), Monaco Editor, and WebContainer.

Users can sign in, create playgrounds from templates, edit files in-browser, run code in an isolated container, and manage projects from a dashboard.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- NextAuth v5 (GitHub + Google OAuth)
- Prisma + MongoDB
- Monaco Editor
- WebContainer API
- Zustand for playground/editor state

## Features

- OAuth authentication with GitHub and Google
- Protected dashboard with user-specific playgrounds
- Create, duplicate, update, star, and delete playgrounds
- File explorer operations inside playground:
  - add/rename/delete files and folders
  - open/close tabs
  - per-file save and save-all
- Live preview via WebContainer instance
- Exit flow from playground back to dashboard with container teardown

## Project Structure

```text
app/
	(auth)/auth/sign-in/    # Auth pages
	(root)/                 # Landing/root pages
	dashboard/              # Protected dashboard route
	playground/[id]/        # Editor + file tree + preview
	api/auth/               # Auth handlers
	api/template/           # Template API

modules/
	auth/                   # Auth actions/types/components
	dashboard/              # Dashboard UI + server actions
	playground/             # Editor, explorer, file operations, hooks
	web-containers/         # WebContainer preview + hook

prisma/
	schema.prisma           # MongoDB models
```

## Data Model (High Level)

- User, Account, Session managed through NextAuth + Prisma adapter
- Playground linked to a user
- TemplateFile stores serialized file tree/content per playground
- StarMark stores user-to-playground starring
- ChatMessage model exists for user message history

See prisma/schema.prisma for full schema.

## Auth and Routing Notes

- Public route: `/`
- Auth page: `/auth/sign-in`
- Protected route: `/dashboard`
- Middleware redirects unauthenticated users to sign-in

Route behavior is controlled in `routes.ts` and `middleware.ts`.

## Playground Flow

1. Dashboard opens/creates a playground record
2. Playground page loads saved template content or fetches template JSON
3. WebContainer boots for live preview
4. File edits are tracked in state and can be saved back to DB
5. Exit action tears down container and returns to dashboard