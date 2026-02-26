# 🚀 GetDone --- Modern Kanban Productivity Suite

```{=html}
<p align="center">
```
`<b>`{=html}Streamline your workflow. Master your time. Get things
done.`</b>`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## 🌟 Overview

**GetDone** is a high-performance, minimalist Kanban-style task manager
designed for modern professionals. Built with a "Mobile-First"
philosophy, it offers a seamless experience from desktop to smartphone,
ensuring your productivity never hits a bottleneck.

------------------------------------------------------------------------

## ✨ Key Features

-   🔐 **Secure Ecosystem**: Enterprise-grade authentication via Email,
    Google, and Discord using Supabase Auth.
-   ☁️ **Live Cloud Sync**: Instant data persistence with a managed
    PostgreSQL backend.
-   🏷 **Pro Tagging System**: Organize tasks with a custom-colored
    tagging engine (up to 8 unique tags per user).
-   🕒 **Real-Time Dashboard**: Integrated live clock and date tracking
    for precise time management.
-   🎨 **Glassmorphism UI**: Beautiful, responsive interface with smooth
    CSS transitions and native-feel animations.
-   🛡 **RLS Protected**: Robust Row-Level Security ensuring your data is
    private and encrypted.

------------------------------------------------------------------------

## 🛠 Tech Stack

  Layer          Technology
  -------------- -----------------------------------------
  **Frontend**   React 18 + Vite
  **Backend**    Supabase (BaaS)
  **Database**   PostgreSQL
  **UX/UI**      Modern CSS + NProgress (Loading states)

------------------------------------------------------------------------

## 🚀 Installation & Setup

### 1. Clone the project

``` bash
git clone https://github.com/alexkuznecov16/Task-Manager.git
cd Task-Manager
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

``` env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### 4. Launch Development Server

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🗄 Database Architecture

The application architecture is built on three core relational pillars:

-   **Columns** --- Dynamic stage management (Backlog ➔ Doing ➔ Done)
-   **Tasks** --- Rich data objects containing descriptions, tags, and
    deadlines
-   **Tags** --- User-defined metadata linked via `user_id` for
    personalized sorting

------------------------------------------------------------------------

## 🚧 Roadmap (Coming Soon)

-   [ ] 🔄 Drag & Drop: Native interactive reordering\
-   [ ] 🌙 Dark Mode: Optimized UI for late-night deep work\
-   [ ] 🔔 Deadlines 2.0: Email and Browser push notifications\
-   [ ] 📊 Analytics: Productivity charts and completion heatmaps

------------------------------------------------------------------------

## 👨‍💻 Author

**Alexander Kuznetsov**\
Full-Stack Developer \| Open-Source Contributor

-   Telegram: https://t.me/kznws111\
-   Email: alexander.kuznecov16@gmail.com\
-   Live Demo: https://getdone.online

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<i>`{=html}"Success is the sum of small efforts, repeated day in and
day out."`</i>`{=html}
```{=html}
</p>
```
