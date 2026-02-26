🚀 ToDo App
====================================================

Live Demo: https://www.getdone.online


----------------------------------------------------
📌 About the Project
----------------------------------------------------

ToDo App is a modern single-board task management application built with React (Vite) and powered by Supabase.

The application allows users to securely register, log in, create columns, manage tasks, and store all data in a cloud PostgreSQL database.

Each user has isolated access to their own data.


----------------------------------------------------
✨ Features
----------------------------------------------------

✔ Secure Authentication (Sign Up / Login)
✔ Email confirmation required after registration
✔ Editable user profile (name & email)
✔ Single Board structure (one board per user)
✔ Create / Edit / Delete columns
✔ Create / Edit / Delete tasks
✔ Mark tasks as completed
✔ Modern responsive UI
✔ Live date & time in header
✔ Horizontal scrollable board
✔ Data stored securely in Supabase


----------------------------------------------------
🔐 Authentication Flow
----------------------------------------------------

1. User registers with:
   - Name
   - Email
   - Password

2. Supabase sends a confirmation email.
3. User must confirm the email via the provided link.
4. After confirmation, the user can log in and access the application.

All authentication is securely handled by Supabase.


----------------------------------------------------
🛠 Tech Stack
----------------------------------------------------

Frontend:
- React
- Vite
- Modern CSS

Backend / Database:
- Supabase
- PostgreSQL
- Supabase Auth


----------------------------------------------------
🗄 Database Structure
----------------------------------------------------

Table: columns
- id
- title
- order
- board_id
- user_id

Table: tasks
- id
- title
- completed
- order
- column_id
- user_id

Row Level Security (RLS) is enabled to ensure users can only access their own data.


----------------------------------------------------
⚙️ Installation
----------------------------------------------------

1. Clone the repository:

   git clone https://github.com/alexkuznecov16/ToDo-App.git
   cd todo-app

2. Install dependencies:

   npm install

3. Configure Supabase (src/supabase.js):

   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co'
   const supabaseKey = 'YOUR_PUBLIC_ANON_KEY'

   export const supabase = createClient(supabaseUrl, supabaseKey)

4. Run the project:

   npm run dev


----------------------------------------------------
🎨 UI Highlights
----------------------------------------------------

- Sticky modern header
- Real-time date and clock
- Glass-style columns
- Smooth animations
- Fully responsive layout
- Horizontal scroll support for multiple columns


----------------------------------------------------
🚧 Future Improvements
----------------------------------------------------

- Drag & Drop task reordering
- Column drag & drop
- Real-time updates
- Task deadlines
- Dark / Light theme toggle


----------------------------------------------------
👨‍💻 Author
----------------------------------------------------

Alexander Kuznetsov

Telegram: @kznws111
Email: alexander.kuznecov16@gmail.com


----------------------------------------------------
🌐 Live Website
----------------------------------------------------

https://to-do-app-murex-nine.vercel.app

====================================================
