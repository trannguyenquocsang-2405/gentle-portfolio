# 🚀 Fullstack Personal Portfolio & CMS

A complete, full-stack personal portfolio and blog platform equipped with a custom Content Management System (CMS). Designed to showcase projects, manage work experiences, and publish blog posts dynamically—without needing to touch the source code after deployment.

## ✨ Features

- 🎨 **Dynamic Portfolio:** Showcase your projects with demo URLs, source code links, and rich Markdown descriptions.
- 💼 **Experience Timeline:** Manage and display your work history, roles, and product links seamlessly.
- 📝 **Integrated Markdown Blog:** Write, edit, and publish blog posts directly from the custom Admin Dashboard using a WYSIWYG Markdown editor.
- 🛠️ **Custom Admin Panel:** A comprehensive backend interface to update your profile (avatar, greetings), skills, social links, and resume.
- ⚡ **High Performance:** Powered by React Query for intelligent caching, smooth state management, and fast navigation.
- 📱 **Responsive Design:** Fully responsive UI crafted with Tailwind CSS v4.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4 + Tailwind Typography
- **State/Fetching:** TanStack React Query v5 + Axios
- **Routing:** React Router v7
- **Markdown:** React Markdown, UIW React MD Editor

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **File Upload:** Cloudinary / Multer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Cloudinary account (for image uploads)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
# Create a .env file based on the provided .env.example (if any) and add your DATABASE_URL
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
# Example: VITE_API_URL=http://localhost:3000

# Start the Vite development server
npm run dev
```

---

## 🗄️ Database Schema Overview

The database is powered by PostgreSQL and managed via Prisma. Core models include:
- `Profile`: Manages name, avatar, greeting, and about text.
- `Project`: Stores project details, demo URLs, and descriptions.
- `BlogPost`: Manages markdown blog posts (published/draft).
- `Experience`: Work history and roles.
- `Skill` & `SkillCategory`: Grouped technical skills.
- `Resume`: Links to the latest CV/Resume file.

## 🤝 Contributing
Since this is a personal portfolio template, feel free to fork this repository, customize the UI, and connect it to your own database to make it yours!

## 📄 License
This project is open-source and available under the MIT License.
