# Vitto - Loan Application Portal

A secure, mobile-responsive, and modern full-stack web application designed for inclusive FinTech. This portal allows local-language preferred borrowers to apply for loans (in Hindi, Tamil, Telugu, Marathi, or English) and provides an operations dashboard for agents to track, filter, search, and process (approve/reject) applications in real-time.

---

## 🚀 Deployed URLs
* **Frontend Web App**: https://vitto-r39g-nfdn0q7kj-sujalpawar0804-2981s-projects.vercel.app
* **Backend API Base**: *[User to insert deployed Render/Railway URL]*

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React.js (built with Vite)
  * Customized Glassmorphic CSS design (Light/Dark optimized theme, micro-animations, no Tailwind dependencies).
  * Responsive layout tailored for mobile field agents.
  * Real-time UI state updates (badges, totals, list items) without full page reload.
* **Backend**: Node.js & Express
  * Modular routing, controller patterns, and robust validation middlewares.
  * Secure JSON Web Token (JWT) bearer authentication for agent operations.
* **Database**: PostgreSQL (UUID Primary Keys, indexed fields, parameterized query security).
* **Testing**: Node.js Native Test Runner (zero test bloat, high execution speed).

---

## 📁 Project Structure

```
vitto/
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/           # Database pools & auto-migrations
│   │   ├── controllers/      # Route logic handlers
│   │   ├── middleware/       # JWT and validation middlewares
│   │   ├── routes/           # REST endpoints
│   │   └── app.js            # Express config
│   ├── test/                 # Native Node integration tests
│   ├── .env.example
│   ├── server.js             # Entry point
│   └── package.json
├── frontend/                 # React.js SPA (Vite)
│   ├── src/
│   │   ├── components/       # Header, Stats, StatusBadges
│   │   ├── pages/            # Apply, Login, Dashboard
│   │   ├── styles/           # Custom HSL design styles
│   │   ├── App.jsx           # Routing & session management
│   │   └── config.js         # API endpoint configurations
│   ├── index.html
│   └── package.json
├── migrations/               # PostgreSQL schema definition
│   └── 001_init.sql
├── docs/                     # Full project documentation
│   ├── setup_guide.md        # Local workspace setup guide
│   ├── deployment_guide.md   # Deployment steps (Neon/Render/Vercel)
│   ├── api_documentation.md  # REST API endpoint structures
│   ├── testing_documentation.md # Local test verification guide
│   └── writeup.md            # Recruiter evaluation writeup (print-ready PDF)
└── README.md
```

---

## 📖 Complete Documentation Links
To make local evaluation or deployment as fast and easy as possible, we have split the documentation into comprehensive guides:

1. ⚙️ **[Local Setup Guide](docs/setup_guide.md)**: Spin up the project locally in under 3 minutes.
2. ☁️ **[Deployment Guide](docs/deployment_guide.md)**: Deploy the database, API, and client on cloud services.
3. 📡 **[REST API Documentation](docs/api_documentation.md)**: Details on body payloads, request parameters, and response structures.
4. 🧪 **[Testing Documentation](docs/testing_documentation.md)**: Run the zero-dependency native test suite.
5. 📝 **[Technical Writeup](docs/writeup.md)**: Summary of design decisions, known constraints, and future roadmaps.
