# Fortune Admin and Staff Portals 🚀

## Project Overview 📋

This repository contains the frontend application for the Fortune superadmin and staff portals.

The application is built with **Next.js**, **React**, **TypeScript**, **Material UI**, **TanStack Query**, and other modern frontend technologies.

The project includes authentication, role-based access control, API integration, form validation, and reusable dashboard components.

---

## How to Get Started 🚀

### 1. Clone the repository

```bash
git clone https://github.com/miyakeyudai9-lang/admin-dashboard.git
```

Move into the project directory:

```bash
cd admin-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory.

Use the required environment variables, for example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Do not commit `.env.local` to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

in your browser.

---

## Commands ⬇️

| **Command**          | **Description**                            |
| -------------------- | ------------------------------------------ |
| `npm install`        | Install project dependencies               |
| `npm run dev`        | Start development server                   |
| `npm run build`      | Create production build                    |
| `npm run start`      | Start production server                    |
| `npm run lint`       | Run ESLint                                 |
| `npm run type-check` | Run TypeScript type checking if configured |

---

## Tech Stack 📚

| **Technology**    | **Description**                               |
| ----------------- | --------------------------------------------- |
| `Next.js 16`      | React framework using App Router              |
| `React 19`        | Frontend UI library                           |
| `TypeScript`      | Static type checking                          |
| `Material UI`     | UI component library                          |
| `TanStack Query`  | Server-state management and API data fetching |
| `Axios`           | HTTP client and API interceptors              |
| `React Hook Form` | Form state management                         |
| `Zod`             | Form schema validation                        |
| `Zustand`         | Client-side global state management           |
| `Next/Image`      | Image optimization                            |
| `React Icons`     | Icon library                                  |
| `ESLint`          | Code quality and linting                      |

---

## Project Structure 📁

```text
admin-dashboard/
│
├── app/
│   ├── login/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── dashboard/
│   ├── providers/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── auth/
│   ├── common/
│   └── layouts/
│
├── hooks/
│   ├── use-login.ts
│   └── use-auth.ts
│
├── lib/
│   ├── axios.ts
│   └── permissions.ts
│
├── services/
│   └── auth.service.ts
│
├── store/
│   └── auth-store.ts
│
├── public/
│   └── assets/
│       └── images/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

## Authentication 🔐

The application has separate sign-in entry points and protected areas:

* Superadmin sign-in: `/login` → `/admin/dashboard`
* Staff sign-in: `/staff/login` → `/staff/dashboard`
* Staff client workflows live under `/staff/client`; superadmin workflows live under `/admin/client`.

The backend exposes role-scoped login endpoints at `/api/auth/admin/login` and `/api/auth/staff/login`. The legacy `/api/auth/login` endpoint remains admin-only. Both portals use `/api/auth/me` for session validation, and role authorization is enforced by backend route middleware as well as frontend layouts.

Authentication flow:

```text
Login
   ↓
API Authentication
   ↓
Access Token / Session
   ↓
User Information
   ↓
Role
   ↓
Dashboard
```

The project includes:

* Login
* Logout
* Forgot password
* Password reset
* Authentication state
* API authorization
* Role-based UI control
* Protected pages

---

## Role-Based Access 👥

User information and roles can be managed globally using **Zustand**.

Example roles may include:

```text
admin
manager
staff
user
```

Different pages, actions, menus, and components can be displayed depending on the authenticated user's role.

Frontend role checking is used for UI control only.

Authorization must also be validated by the backend API.

---

## API Integration 🌐

API requests are handled using **Axios**.

The Axios instance is configured in:

```text
lib/axios.ts
```

Example:

```ts
api.get("/users");

api.post("/login", data);

api.put("/users/1", data);

api.delete("/users/1");
```

Axios interceptors are used for authentication and global API response handling.

---

## Server State 🔄

**TanStack Query** is used for API data fetching, mutations, caching, loading states, and error handling.

Example query:

```ts
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});
```

Example mutation:

```ts
useMutation({
  mutationFn: login,
});
```

---

## Forms & Validation ✅

Forms are managed using:

```text
React Hook Form
+
Zod
```

Example validation flow:

```text
Form Input
   ↓
React Hook Form
   ↓
Zod Validation
   ↓
Valid Data
   ↓
TanStack Mutation
   ↓
Axios
   ↓
Backend API
```

---

## UI 🎨

The application uses **Material UI (MUI)**.

Global styles and component customization are managed through the MUI theme.

Common components include:

* Buttons
* Outlined inputs
* Form labels
* Dialogs
* Cards
* Tables
* Navigation
* Dashboard layouts

---

## Git Workflow 🌿

The default development branch is:

```text
develop
```

Recommended workflow:

```text
develop
   ↑
feature/*
   ↑
individual development tasks
```

Example feature branches:

```text
feature/AUTH-1-login
feature/AUTH-2-forgot-password
feature/AUTH-3-reset-password
feature/DASH-1-dashboard
```

When working with Jira, include the Jira task ID in:

* Branch names
* Commit messages
* Pull request titles

Example:

```bash
git checkout -b feature/AUTH-2-forgot-password
```

Commit:

```bash
git commit -m "AUTH-2 Add forgot password flow"
```

---

## Development Guidelines 🛠️

Before creating a pull request:

```bash
npm run lint
npm run build
```

Developers should:

* Use TypeScript types
* Keep reusable components separate
* Avoid duplicated API logic
* Use TanStack Query for server state
* Use Zustand for appropriate client-side global state
* Use React Hook Form and Zod for forms
* Follow the established MUI theme
* Keep secrets outside the repository
* Use meaningful branch and commit names

---

## Deployment 🚀

Create the production build:

```bash
npm run build
```

Run the production application:

```bash
npm run start
```

The application can be deployed using platforms that support Next.js, such as **Vercel**, Docker-based infrastructure, or your own server environment.

---

## Repository

GitHub:

```text
https://github.com/miyakeyudai9-lang/admin-dashboard
```

---

Happy coding ✌️
