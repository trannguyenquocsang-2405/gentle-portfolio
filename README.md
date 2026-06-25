# 🚀 Gentle Portfolio & Headless CMS

A highly optimized, full-stack personal portfolio and blog platform equipped with a **Custom Multilingual Content Management System (CMS)**. Designed from the ground up to showcase projects, manage work experiences, and publish blog posts dynamically.

## ✨ Key Achievements & Features

- 🏗️ **Clean Architecture:** Frontend logic is decoupled into distinct layers—UI Views, API Services, and State Providers—ensuring long-term maintainability and scalability.
- 🌍 **Native Multilingual (i18n) Engine:** Built a custom localization system utilizing PostgreSQL's `JSONB` to store dual-language content (English/Vietnamese). The Admin Dashboard provides side-by-side editing, while the Frontend dynamically switches languages without reloading.
- 🎨 **Minimalist & Dynamic UI:** Crafted an elegant, responsive interface with Tailwind CSS v4 featuring smooth micro-animations and seamless Light/Dark mode transitions.
- 📝 **Integrated Markdown Blog:** Write, edit, and publish blog posts natively from the custom Admin Dashboard using a WYSIWYG Markdown editor.
- 🛠️ **Custom Admin Panel:** A secure backend interface to update your profile (avatar, greetings), categorize skills, upload CVs (PDFs), and manage work history.
- ⚡ **High Performance & Type-Safety:** End-to-end type safety using TypeScript across both Frontend (React) and Backend (NestJS).
- ☁️ **Cloud Storage Integration:** Handled direct image and PDF uploads securely to Cloudinary.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + Tailwind Typography
- **Architecture:** Clean Architecture (Services, Contexts, Views)
- **Routing & State:** Next.js App Router + React Context API
- **Editor:** UIW React MD Editor (Markdown)

### Backend
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Extensive use of `JSONB` for i18n)
- **Storage:** Cloudinary (Images & PDF Uploads)
- **Security:** REST API endpoints with robust error handling

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Cloudinary account (for media uploads)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
# Create a .env file and add your DATABASE_URL and CLOUDINARY credentials
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# Generate Prisma Client & Push schema to DB
npx prisma generate
npx prisma db push

# Start the NestJS server
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
# Create a .env file and set your API URL
# Example: NEXT_PUBLIC_API_URL=http://localhost:3000

# Start the Next.js development server
npm run dev
```

## 🗄️ Database Architecture

The database is powered by PostgreSQL. Core tables include:
- `Profile`: Manages identity, avatar, and localized greeting/about strings.
- `Project`: Stores project details, demo URLs, and localized descriptions.
- `BlogPost`: Manages markdown blog posts with localized titles and content.
- `Experience`: Work history with JSONB roles and descriptions.
- `Skill` & `SkillCategory`: Grouped technical skills, localized categories.
- `Resume`: Links to the latest CV/Resume files securely.

## 🤝 Contributing
Since this is a personal portfolio template, feel free to fork this repository, customize the UI, and connect it to your own database to make it yours!

## 📄 License
This project is open-source and available under the MIT License.
