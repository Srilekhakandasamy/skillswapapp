# ⚡ SkillSwap App (MERN Stack)

A peer-to-peer skill exchange platform where users trade their skills directly—no money needed! Teach what you know, learn what you want.

---

## 🚀 Quick Start on Localhost

You can run both backend and frontend together with a single command!

### Option 1: One-Click Startup (Windows)
Double-click `run-localhost.bat` in the project root.

### Option 2: Command Line Startup
1. Open a terminal in the project root:
   ```bash
   npm start
   ```
   *(or `npm run dev`)*

This starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

---

## 🗄️ Database (Zero Setup Needed!)

The backend includes a resilient, 3-tier database connector:
1. **Configured `MONGO_URI`**: Connects to your MongoDB Atlas cluster if provided.
2. **Local MongoDB**: Automatically connects to local MongoDB on port 27017 (`mongodb://127.0.0.1:27017/skillswap`).
3. **In-Memory Embedded Fallback (`mongodb-memory-server`)**: If neither is running, an in-memory MongoDB server starts automatically in background. **Zero installation or cloud setup required to run locally!**

When starting with a fresh database, demo users and sample skills are automatically seeded.

---

## 👤 Built-in Demo Accounts

Use these accounts to test the entire mutual matching and swap flow:

| Name | Email | Password | Offers | Requests | Mutual Match |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Alice Johnson** | `alice@example.com` | `password123` | React & Web Dev | UI/UX & Figma | **Matches Bob** |
| **Bob Smith** | `bob@example.com` | `password123` | UI/UX & Figma | React & Web Dev | **Matches Alice** |
| **Charlie Brown** | `charlie@example.com` | `password123` | Python Data Science | React & Web Dev | — |

*Quick login buttons are also available directly on the login page for instant 1-click sign-in.*

---

## 🌟 Key Features

1. **Authentication & Profile**:
   - Secure sign up, login, and JWT-authenticated sessions.
   - User profile stats and average peer rating.

2. **Skill Marketplace (`/skills`)**:
   - Post skills you **Offer to Teach** or **Want to Learn**.
   - Set skill level (`Beginner`, `Intermediate`, `Advanced`), categories, and tags.
   - Filter by All, Offers, or Requests; instant search bar.
   - Send swap requests directly to peers specifying what you offer and your session goal.

3. **Mutual Matching Engine (`/dashboard`)**:
   - Analyzes skills offered and skills requested between users.
   - Accurately highlights **Mutual Matches** where User A teaches what User B wants AND User B teaches what User A wants.

4. **Swap Sessions & Scheduling (`/bookings`)**:
   - Incoming & Outgoing swap management.
   - Accept or Decline incoming swap proposals.
   - Senders can schedule session date/time, Zoom/Google Meet links, and agendas.
   - Mark sessions as completed once learning is finished.

5. **Community Ratings & Reviews (`/reviews`)**:
   - Leave 1–5 star ratings and feedback for partners after completing sessions.
   - Dynamically recalculates the partner's average community rating.
   - View reviews received from other peers.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS, Axios.
- **Backend**: Node.js, Express 5, MongoDB / Mongoose, `mongodb-memory-server`, JWT, Bcrypt.js.
