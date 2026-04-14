# 🚀 TaskNest – Smart Collaboration Platform

TaskNest is a modern task and project management platform inspired by tools like Jira and Trello. It enables teams to collaborate, track progress, and manage workflows efficiently.

---

## ✨ Features

### 🔐 Authentication

- Login / Signup system
- Role-based access (Admin / Member)
- Protected routes

### 📁 Projects

- Create, edit, delete projects
- Assign multiple admins and members
- Project overview with progress tracking

### ✅ Tasks

- Full CRUD operations
- Fields:
  - Title, Description
  - Status (Todo / In Progress / Done)
  - Priority (Low / Medium / High)
  - Assigned User
  - Start Date & Due Date
- Due date indicators (red when near/overdue)
- Completed tasks auto-highlighted

### 📊 Dashboard

- Project statistics
- Progress bars with animation
- Recent projects preview

### 📋 Kanban Board

- Drag & drop (DND)
- Status-based columns
- Role-based interaction (only assigned tasks draggable)

### 📅 Calendar

- Month & Week view
- Tasks mapped by due date
- Tooltip + priority indicators

### ⚙️ Settings

- Profile management (name, email, photo)
- Members management per project
- Theme support (light/dark)

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **State Management:** TanStack Query + Redux Toolkit (UI state)
- **Backend (Mock):** JSON Server
- **Styling:** CSS Modules
- **Animations:** Framer Motion
- **Drag & Drop:** @hello-pangea/dnd

---
