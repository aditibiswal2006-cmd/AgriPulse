# 🌾 AgriPulse
### Basic Interactive Farmer Support & Agriculture Information System

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A lightweight, browser-based platform connecting farmers with agricultural officers for timely guidance on crops, irrigation, soil management, pest control, and more.

---

## 🚀 Live Demo

> Deploy on GitHub Pages, Netlify, or Vercel — no backend or database required.

---

## 📸 Screenshots

| Login Page | Farmer Dashboard | Officer Dashboard |
|---|---|---|
| *(Add screenshot)* | *(Add screenshot)* | *(Add screenshot)* |

---

## ✨ Features

- 👨‍🌾 **Farmer Login** — Enter name & Farmer ID to access your personal query dashboard
- 🏛️ **Officer Login** — Secure demo login for agricultural officers
- 📝 **Query Submission** — Submit issues with category, priority (Low / Moderate / Critical), and description
- 📋 **Query Tracking** — Farmers see only their own queries with live status updates
- ✍️ **Officer Responses** — Officers read, reply, and update query status (Pending → In Progress → Resolved)
- 📊 **Live Statistics** — Officer dashboard shows real-time counts by status
- 🎨 **Color-coded Badges** — Priority and status visually distinguished
- 💾 **localStorage Persistence** — All data saved in browser, survives page refresh
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
AgriPulse/
├── index.html        # Login page
├── farmer.html       # Farmer dashboard
├── officer.html      # Officer dashboard
├── css/
│   └── style.css     # Complete stylesheet
└── js/
    ├── app.js        # Shared utilities, auth, localStorage helpers
    ├── farmer.js     # Farmer form & query rendering
    └── officer.js    # Officer stats, reply modal, search & filter
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure, forms, semantic layout |
| **CSS3** | Responsive design, animations, color-coded UI |
| **Vanilla JavaScript** | Login, query submission, dynamic rendering |
| **localStorage** | Persistent browser-side data storage |

---

## 🔑 Demo Credentials

| Role | Detail |
|---|---|
| 👨‍🌾 Farmer | Any name + any ID (e.g. `F-1001`) |
| 🏛️ Officer | Username: `admin` · Password: `officer123` |

---

## ⚡ Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/AgriPulse.git

# Open in browser
cd AgriPulse
# Just open index.html — no npm, no server needed!
```

Or deploy instantly:
- **GitHub Pages** → Settings → Pages → Deploy from `main` branch root
- **Netlify** → Drag & drop the folder
- **Vercel** → Import repo, framework: *Other*

---

## 📋 Query Categories

- 🌿 Crop Disease
- 💧 Irrigation
- 🪨 Soil Management
- 🐛 Pest Control
- 🌱 Seeds & Nursery
- 🧪 Fertilizer & Nutrients
- ⛅ Weather & Climate
- 📈 Market Prices

---

## 📄 License

MIT © 2025 — Free to use and modify.
