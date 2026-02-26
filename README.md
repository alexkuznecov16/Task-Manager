# 🚀 GetDone --- Modern Kanban Productivity Suite

**Streamline your workflow. Master your time. Get things done.**

------------------------------------------------------------------------

## 🌟 Overview

**GetDone** is a high‑performance, minimalist Kanban‑style task manager
designed for modern professionals. Built with a **Mobile‑First
philosophy**, it delivers a seamless experience across desktop and
mobile devices.

------------------------------------------------------------------------

## ✨ Key Features

-   🔐 **Secure Authentication** --- Email, Google, and Discord via
    Supabase Auth\
-   ☁️ **Cloud Sync** --- Real‑time PostgreSQL database persistence\
-   🏷 **Tagging System** --- Custom color tags (up to 8 per user)\
-   🕒 **Live Dashboard** --- Real‑time clock and date tracking\
-   🎨 **Modern UI** --- Glassmorphism design with smooth animations\
-   🛡 **Row‑Level Security (RLS)** --- Full data privacy and protection

------------------------------------------------------------------------

## 🛠 Tech Stack

  Layer      Technology
  ---------- ------------------------
  Frontend   React 18 + Vite
  Backend    Supabase
  Database   PostgreSQL
  UI/UX      Modern CSS + NProgress

------------------------------------------------------------------------

## 🚀 Installation & Setup

### 1. Clone repository

``` bash
git clone https://github.com/alexkuznecov16/Task-Manager.git
cd Task-Manager
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment

Create `.env` file in root:

``` env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### 4. Run development server

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🗄 Database Architecture

Core entities:

-   **Columns** --- Workflow stages (Backlog → Doing → Done)
-   **Tasks** --- Task content, tags, deadlines
-   **Tags** --- User‑specific labels

------------------------------------------------------------------------

## 🚧 Roadmap

-   [ ] Drag & Drop support\
-   [ ] Dark Mode\
-   [ ] Notifications (Email + Browser)\
-   [ ] Analytics dashboard

------------------------------------------------------------------------

## 👨‍💻 Author

**Alexander Kuznetsov**\
Full‑Stack Developer

-   Telegram: https://t.me/kznws111\
-   Email: alexander.kuznecov16@gmail.com\
-   Live Demo: https://getdone.online

------------------------------------------------------------------------

> Success is the sum of small efforts, repeated day in and day out.
