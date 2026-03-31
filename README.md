# ビアログ Beer Log (Japanese Craft Beer Review App)

## Overview

A full-stack web application designed for the Japanese market, allowing users to discover, review, and manage craft beers and breweries with a rating system aligned to local tastes.

Most existing beer review platforms are built outside Japan, resulting in rating systems that often reflect Western preferences. This project aims to address that gap by providing a platform tailored to Japanese users.

The application uses a decoupled architecture, separating frontend and backend for better scalability and maintainability.

ビールおよびブルワリーの登録・管理機能とレビュー投稿機能を備え、ユーザーがお気に入りのビールを発見できるWebアプリの開発・実装

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Zod validation
- React Hook Form
- useActionState (Server Actions)

### Backend
- Node.js
- Express
- Zod validation
- REST API

### Database
- PostgreSQL

### Authentication & Security
- bcrypt (password hashing)
- JWT (authentication)
- HTTPS-only cookies

---

## Architecture

- Decoupled frontend and backend
- RESTful API design
- Relational data modeling:
  - Users
  - Beers
  - Breweries
  - Reviews
  - Review Pictures
  - Activity Log

---

## Features

### Authentication & Authorization
- Secure login and signup system
- JWT-based authentication
- Role-based access control:
  - Basic Users
    - Create and edit beers, breweries, and reviews
    - Edit their own content
  - Admin Users
    - Full data control
    - Soft delete, hard delete, and restore
    - Access to admin dashboard

### Core Functionality
- Beer and brewery listings
- Review system
- Search functionality
- Admin management panel

### Search
- Keyword-based search using SQL LIKE
- Pagination with limit and offset

### Rendering Strategy

- SSG (Static Site Generation)
  - Beer detail pages
  - Brewery detail pages
  - Improves SEO and crawlability

- CSR (Client Side Rendering)
  - Paginated data such as reviews and lists
  - Improves user experience for dynamic content

### Forms

- Text-based forms
  - Built with useActionState
  - Server and client validation

- Image upload forms
  - Built with React Hook Form
  - Allows front end validation of image data

### Pagination Strategy

- Cursor Pagination
  - Used for activity feeds
  - Optimized for continuous browsing

- Offset / Limit Pagination
  - Used for beers, breweries, and reviews
  - Allows bookmarking and sharing URLs

---

## Security

- Password hashing with bcrypt
- JWT authentication
- HTTPS-only cookies to mitigate XSS risks
- Role-based permission control
- Rate limiting and CORS permissions

---

## Key Design Decisions

- Decoupled architecture for scalability and flexibility
- Relational database for strong data consistency
- Multiple rendering strategies for performance and SEO
- Dual pagination approach based on user behavior

---

## Future Improvements

- Full-text search (e.g., PostgreSQL tsvector)
- Recommendation system based on user preferences
- Multi-language support
- Image optimization and CDN integration

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/brianamos93/beercomi_front
cd beercomi_front
```
## Getting Started

Install the packages

```bash
npm install

```

First, run the development server:

```bash
npm run dev

```

Second, build and start the final version:

```bash
npm run build

npm run start

```

Create .env files for the front end.


```bash
NEXT_PUBLIC_BACKEND_URL=
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Folder layout (Front End)

beercomi_front top folder
├── app
│   ├── about (page route)
│   ├── actions (server actions)
│   ├── beers (routes and specific components for pages)
│   ├── breweries (routes and specific components for pages)
│   ├── components (shared components)
│   │   ├── beer
│   │   ├── brewery
│   │   ├── form
│   │   ├── interface
│   │   ├── profile
│   │   └── user
│   ├── contact (page route)
│   ├── hooks (hooks)
│   ├── search (page route)
│   ├── unauthorized (page route)
│   ├── users (routes)
│   │   ├── admin (admin panels)
│   │   ├── login (form page)
│   │   ├── profile (user profile page)
│   │   └── signup (form page)
│   └── utils (shared functions) 
│       ├── libs (metadata base and token functions)
│       ├── requests (server request to the back end)
│       └── schemas (zod validation schemas)
└── public (front end images)
