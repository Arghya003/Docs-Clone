# 📄 Google Docs Clone - Full Stack Real-Time Collaborative Editor

A modern, full-stack, real-time collaborative document editor built with **React 18**, **Vite**, **Quill.js**, **Material UI**, **Socket.IO**, **Node.js**, and **MongoDB**.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=nodedotjs)
![Socket.IO](https://img.shields.io/badge/Socket.io-4.7-black?logo=socketdotio)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)

---

## ✨ Features

- **📂 Document Management Dashboard**: Browse, search, create, and delete saved documents stored in MongoDB with mini canvas preview thumbnails.
- **⚡ Real-Time Collaboration**: Instant text synchronization across multiple browser windows powered by WebSockets (`socket.io`).
- **👥 Active Collaborator Presence**: Live active user count badge and collaborator avatars per document room.
- **📝 Google Docs Rich Text Editor**: Powered by Quill.js with an A4 paper canvas layout and sticky glassmorphism formatting toolbar.
- **📌 Live Editable Document Title**: Inline document title editing with real-time sync across connected clients.
- **📥 Multi-Format Export**: Download documents instantly as **PDF** (`.pdf`), **Plain Text** (`.txt`), or **HTML** (`.html`).
- **🔗 One-Click Shareable Link**: Copy unique document URLs to clipboard with toast notifications.
- **📊 Real-Time Analytics Bar**: Floating widget displaying word count, character count, and estimated reading time.
- **🌓 Dark & Light Mode Theme**: Seamless theme toggling with persisted user preferences.

---

## 🛠️ Tech Stack

### Client Frontend
- **Framework**: React 18 (Vite)
- **UI & Icons**: `@mui/material`, `@mui/icons-material`
- **Rich Text Engine**: `quill`, `quill/dist/quill.snow.css`
- **Real-Time Communication**: `socket.io-client`
- **Routing**: `react-router-dom` v6
- **PDF Generation**: `html2pdf.js`

### Server Backend
- **Runtime**: Node.js (ES Modules)
- **WebSocket Engine**: `socket.io`
- **Database**: MongoDB (Mongoose ORM)
- **Environment**: `dotenv`

---

## 📁 Repository Structure

```
Docs-Clone/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── assets/             # Constants & Toolbar Options
│   │   ├── components/
│   │   │   ├── Dashboard.jsx   # Document Management & Grid Page
│   │   │   ├── Editor.jsx      # Quill Editor & Real-Time Sync Container
│   │   │   ├── Navbar.jsx      # Top Header, Title Editor, Presence & Export
│   │   │   └── StatsBar.jsx    # Live Word & Character Analytics Capsule
│   │   ├── App.css             # Main Design System & Paper Styling
│   │   ├── index.css           # Global Theme CSS Variables
│   │   ├── App.jsx             # Router & Theme Controller
│   │   └── main.jsx            # Entry Point
│   └── package.json
│
└── server/                     # Node.js Socket.IO & Mongoose Backend
    ├── controller/
    │   └── document-controller.js  # DB Controllers (Create, Read, Update, Delete)
    ├── database/
    │   └── db.js               # MongoDB Connection Setup
    ├── Schema/
    │   └── documentSchema.js   # Mongoose Document Schema (Title, Data, Timestamps)
    ├── .env                    # Environment Variables (MONGO_URI, PORT)
    ├── index.js                # Socket.IO Event Handlers & Server Bootstrap
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB Atlas** database URI (or local MongoDB server)

---

### 1. Server Setup

Navigate to the `server` directory, install dependencies, and configure environment variables:

```bash
cd server
npm install
```

Create or verify the `.env` file inside `server/`:

```env
PORT=9000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

Start the backend development server:

```bash
npm run dev
```

The Socket.IO server will start listening on `http://localhost:9000`.

---

### 2. Client Setup

Open a new terminal window, navigate to the `client` directory, and install dependencies:

```bash
cd client
npm install --legacy-peer-deps
```

Start the Vite client development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🔌 Socket.IO Event Reference

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `get-all-documents` | Client ➔ Server | Requests a list of all documents sorted by last updated |
| `load-all-documents` | Server ➔ Client | Returns array of all saved documents |
| `get-document` | Client ➔ Server | Joins document room and fetches content & title |
| `load-document` | Server ➔ Client | Emits document content and title to requester |
| `send-changes` | Client ➔ Server | Broadcasts Quill text deltas to active room members |
| `receive-changes` | Server ➔ Client | Receives text deltas from remote collaborators |
| `update-title` | Client ➔ Server | Updates document title in DB and broadcasts to room |
| `receive-title-change` | Server ➔ Client | Receives real-time title update |
| `save-document` | Client ➔ Server | Periodically auto-saves document Delta content |
| `delete-document` | Client ➔ Server | Deletes a document by ID and refreshes doc list |
| `active-users` | Server ➔ Client | Emits total active user count in current document room |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
