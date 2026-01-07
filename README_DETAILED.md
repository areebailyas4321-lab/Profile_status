# Project Detail: Simple User Status App

This document explains **how the project works** in simple terms for a beginner. It covers the Backend, Database, and how everything connects.

---

## 1. How the Backend Works
The **Backend** is like the "brain" of the application. It runs on a server (your computer, on port 5000) and handles data.

### Key Files in `backend/`
- **`src/app.js`**: This is the **entry point**. It starts the server, connects to the database, and sets up rules (like CORS) so the frontend can talk to it.
- **`src/routes/userSettingsRoutes.js`**: These are the **URLs** the frontend visits.
    - `GET /api/user-settings/:userId` -> "Hey, give me the status for this user."
    - `PUT /api/user-settings/:userId` -> "Hey, update the status for this user."
- **`src/controllers/userSettingsController.js`**: This contains the **logic**. When a route is visited, these functions run.
    - `getUserSettings`: Looks for data in the database.
    - `updateUserSettings`: Changes data in the database.

---

## 2. How Data is Stored in MongoDB
**MongoDB** is a database that stores data like JSON documents (similar to JavaScript objects).

### The Model (`backend/src/models/UserSettings.js`)
We defined a "Schema" (a blueprint) for what our data looks like:
```javascript
{
    userId: "user123",      // Unique ID for the user
    status: "Online",       // OR "Offline"
    theme: "Light",         // OR "Dark"
    createdAt: "...",       // When it was created
    updatedAt: "..."        // When it was last changed
}
```

When you click "Set Offline" on the frontend:
1.  Frontend sends a message to Backend.
2.  Backend finds the document with `userId: "user123"`.
3.  Backend changes `status` to "Offline".
4.  Backend saves it to MongoDB.

---

## 3. Frontend to Backend Connection
The **Frontend** (React) talks to the Backend using `fetch` (a built-in tool to make web requests).

**File: `src/context/StatusContext.jsx`**
- **Refactored Code**: We changed this file to stop using just "Local Storage" (browser memory) and start using the "API" (Backend).
- **`fetch('http://localhost:5000/...')`**: This command sends the data to your running backend.

---

## 4. Summary of Code Purposes
| Folder/File | Purpose |
|Data | Stores |
| `src/components/` | **Visuals**: Buttons, Profile Card, Navbar. |
| `src/context/` | **State Management**: Keeps track of "Is user Online?" and tells components about it. |
| `backend/src/models/` | **Database Blueprint**: Defines what data looks like. |
| `backend/src/routes/` | **Traffic Control**: Decides where requests go. |
| `backend/src/controllers/` | **Worker**: Does the actual job of saving/finding data. |

## 5. How to Run Everything
We made it simple! Just run:
```bash
npm run dev
```
This single command uses a tool called **`concurrently`** to start BOTH the frontend and backend at the same time.
