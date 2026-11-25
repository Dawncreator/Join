# 🗂️ Join – Kanban Project Management

**Join** is a Kanban-style task manager built with plain **HTML**, **CSS** and **vanilla JavaScript**.
Create tasks, assign them to contacts, split them into subtasks and move them across the board with drag and drop.

No frameworks and no build step.

---

## 📑 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
- [Pages](#-pages)
- [Project Structure](#-project-structure)
- [Data Model](#-data-model)
- [Tech Stack](#-tech-stack)

---

## ✨ Features

### Account
- Log in with e-mail and password, or continue as **Guest**
- Sign up with name, e-mail and password
- **Remember me** option for the e-mail address
- Header with the user's initials and a user menu

### Summary
- Number of all tasks and of tasks per status (*To do*, *In progress*, *Await feedback*, *Done*)
- Number of **urgent** tasks and the upcoming deadline
- Greeting that depends on the time of day

### Board
- Four columns: **To do**, **In progress**, **Await feedback**, **Done**
- **Drag and drop** of task cards between the columns, or change the status through the card menu
- Live **search** in title and description
- Detail view with category, description, due date, priority, assigned contacts and subtasks
- Tick off subtasks and follow the progress bar on the card
- **Edit** and **delete** tasks
- Add a task directly from the board

### Add Task
- Title, description and due date (past dates are not allowed)
- Priority **Urgent**, **Medium** or **Low**
- Category **Technical Task** or **User Story**
- Assign one or more contacts with a searchable drop-down
- Add, edit and delete subtasks

### Contacts
- Alphabetical contact list with colored initials
- Create, edit and delete contacts
- Mobile layout with its own detail view and menu

### More
- Help, Legal Notice and Privacy Policy pages
- Responsive design for desktop, tablet and phone

---

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-user>/Join.git
   ```

2. Serve the project folder with a local web server, for example the VS Code extension *Live Server* or:

   ```bash
   npx serve .
   ```

3. Open `index.html` in your browser and log in or continue as **Guest**.

> All paths to scripts, styles and images are relative, so the project can be served from the root of a web server or from a sub folder.
> Use a web server rather than opening the files from the file system.

---

## 📄 Pages

| Page | File | Purpose |
| --- | --- | --- |
| Log in / Sign up | `index.html` | Start page with login, sign up and guest access |
| Summary | `summary.html` | Overview of all tasks |
| Board | `board.html` | Kanban board with drag and drop |
| Add Task | `add-task.html` | Form to create a task |
| Contacts | `contacts.html` | Contact management |
| Help | `help.html` | Short help text |
| Legal Notice | `legal.html` | Legal notice |
| Privacy Policy | `privacy.html` | Privacy policy |

---

## 🗂️ Project Structure

```text
Join/
├── index.html / summary.html / board.html /
│   add-task.html / contacts.html /
│   help.html / legal.html / privacy.html
├── script.js                    # Shared code: data access, session handling, user header
├── style.css                    # Global styles and fonts
├── css/                         # Styles per page and their media queries
│   ├── loginsignup.css / medialoginsignup.css
│   ├── summary.css
│   ├── board.css / mediaboard.css
│   ├── addtask.css / mediaaddtask.css
│   ├── contacts.css / contactsmobile.css
│   ├── menu.css
│   └── help-privacy-legal.css
├── js/
│   ├── login.js                 # Login, sign up, guest login, validation
│   ├── summary.js               # Counters and greeting
│   ├── board.js                 # Board rendering, drag and drop, overlays
│   ├── boardhelpfunctions.js    # Subtasks, editing, progress menu
│   ├── addtask.js               # Add task form logic
│   ├── addtaskhelpfunctions.js  # Validation and saving helpers
│   ├── contacts.js              # Contact list, overlays, create/edit/delete
│   ├── contactshelpfunctions.js # Contact helpers and form validation
│   └── template.js              # HTML templates
├── assets/                      # Icons and images
└── fonts/                       # Local web fonts (Figtree)
```

---

## 🧩 Data Model

The data structure used by the app:

```text
user      → account, mail, code
contacts  → name, mail, phonenumber, color
tasks     → title, description, duedate, category, prio, progress,
            "Assigned To" (contact names), subtask (state, title)
```

The values of `progress` are `to do`, `in progress`, `Await feedback` and `Done`.

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3** with flexbox, grid and media queries
- **JavaScript (ES6+)** with `async`/`await` and `fetch`
- **JSDoc** docstrings for all functions
