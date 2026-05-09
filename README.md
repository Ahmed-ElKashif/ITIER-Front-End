<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=ITIER+Mobile+App;Built+for+ITI+Students+%F0%9F%8E%93;Phase+2+%E2%80%94+Premium+Role-Based+UI" alt="Typing SVG" />

<br/>

<p>
  <img src="https://img.shields.io/badge/React_Native-0.85-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Expo-SDK_52-000020?style=for-the-badge&logo=expo&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Navigation-6.x-8A2BE2?style=for-the-badge&logo=react-router&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Axios-1.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zustand_Context-State-black?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Phase-2_Complete-28A745?style=for-the-badge"/>
</p>

<br/>

> **A production-grade, premium mobile application for ITI students, supervisors, and administrators.**  
> Dynamic Theming · Role-Based Navigation · Real-time Analytics · Seamless UX

<br/>

[![Backend Repository](https://img.shields.io/badge/🔗_Backend_Repo-View_Source-blue?style=flat-square)](https://github.com/Ahmed-ElKashif/ITIER-study-tracker-backend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [What's New in Phase 2](#-whats-new-in-phase-2)
- [Frontend Architecture](#-frontend-architecture)
- [Features by Role](#-features-by-role)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Demo Credentials](#-demo-credentials)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🎯 Overview

**ITIER Mobile App** is the premium frontend interface for the ITIER study tracking ecosystem. Designed specifically for **ITI (Information Technology Institute)** students and supervisors, it delivers a high-end, responsive, and deeply integrated user experience.

The app completely transforms based on the authenticated user's role and their device's light/dark mode preference, offering a bespoke, visually stunning dashboard for everyone from a Day 1 Student to the System Administrator.

---

## 🚀 What's New in Phase 2

| # | Feature | Details |
|---|---|---|
| 1 | 🎨 **Live Dynamic Theme** | Global `ThemeContext` reacts instantly to iOS/Android Light & Dark modes without restarting. |
| 2 | 🎭 **Role-Based Palettes** | UI dynamically colors to ITI brand standards: **Crimson** (Students), **Steel Teal** (Supervisors), and **Deep Gold** (Admins). |
| 3 | 🛣️ **Smart Navigation Routing** | `RootNavigator` automatically redirects `PENDING_APPROVAL`, `SUSPENDED`, and `ARCHIVED` accounts to the correct waiting screens. |
| 4 | 🛡️ **Premium Auth Screens** | Redesigned Login and Registration with floating cards, deep shadows, and crisp typography. |
| 5 | 👨‍💼 **Supervisor Hub** | Full dashboard to approve/reject pending registrations and track student cohort metrics. |
| 6 | 👑 **Admin Console** | Complete management screen to create supervisors and oversee system health. |
| 7 | 📊 **Dynamic Track Selection** | Registration flow now actively pulls available tracks from the backend API. |
| 8 | 🚀 **Performance Optimized** | Styles are memoized (`React.useMemo`) preventing re-renders on every tick, ensuring buttery smooth 60fps scrolling. |

---

## 🏛️ Frontend Architecture

```
┌────────────────────────────────────────────────────────┐
│                      App.tsx                           │
│  (Wraps app in ThemeProvider & AuthProvider Contexts)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   RootNavigator                        │
│   (Listens to Auth state to determine routing)         │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Auth Stack  │    │ Waiting Room │    │  Main Tabs   │
│  (Login/Reg) │    │  (Pending)   │    │(Role-specific)
└──────────────┘    └──────────────┘    └──────────────┘
```

**Context Providers:**
- **AuthContext**: Manages JWT lifecycle, login/register logic, and user role.
- **ThemeContext**: Reads user role + device appearance to inject dynamic color palettes globally.

---

## 🎭 Features by Role

<details>
<summary><b>🎓 Student (Crimson Theme)</b></summary>

| Feature | Description |
|---|---|
| 📝 Log study entries | Fast, intuitive forms for logging daily study hours. |
| 📊 Study history | Scrollable history feed with pull-to-refresh capabilities. |
| 🏆 Leaderboards | Real-time ranking against peers in the same track. |
| 💬 Daily quote | Motivational quote card integrated into the home dashboard. |

</details>

<details>
<summary><b>👩‍💼 Supervisor (Steel Teal Theme)</b></summary>

| Feature | Description |
|---|---|
| ⏳ Approval queue | Review and approve/reject pending student registrations. |
| 👥 Track overview | High-level metrics on cohort performance. |
| 🔍 Student search | Instantly locate students and dive into their detailed logs. |

</details>

<details>
<summary><b>🛡️ Admin (Deep Gold Theme)</b></summary>

| Feature | Description |
|---|---|
| ➕ Create supervisors | Generate supervisor accounts and temporary passwords directly from mobile. |
| 📊 System analytics | High-level system health metrics and aggregate counts. |

</details>

---

## 🛠️ Tech Stack

### Mobile Client
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.85 | Core Framework |
| Expo | SDK 52 | Build Toolchain & CLI |
| TypeScript | 5.x | Type Safety |
| React Navigation | 6.x | Routing (Stack & Bottom Tabs) |
| React Hook Form | 7.x | Performant Form Management |
| Yup | 1.x | Schema Validation |
| Axios | 1.x | API Client |
| AsyncStorage | — | Persistent Token Storage |

---

## 📁 Project Structure

```
ITIER-Front-End/
│
├── 📂 assets/                     ← App icons, splash screens, and images
│   └── logo.png                   ← New premium app logo
│
├── 📂 src/
│   ├── 📂 api/                    ← Axios instance and API endpoint wrappers
│   ├── 📂 components/             ← Reusable UI components (Buttons, Inputs)
│   │   ├── 📂 domain/             ← Business-specific cards (StudentCard, TrackSelector)
│   │   └── 📂 ui/                 ← Core UI primitives (ProgressBar)
│   │
│   ├── 📂 contexts/               ← React Contexts
│   │   ├── AuthContext.tsx        ← JWT and User State
│   │   └── ThemeContext.tsx       ← Live role-based light/dark theme
│   │
│   ├── 📂 navigation/             ← Route Definitions
│   │   ├── RootNavigator.tsx      ← Auth/Role traffic controller
│   │   ├── AdminTabs.tsx
│   │   ├── SupervisorTabs.tsx
│   │   └── StudentTabs.tsx
│   │
│   ├── 📂 screens/                ← Screen Components
│   │   ├── 📂 auth/               ← Login, Register, PendingApproval
│   │   ├── 📂 student/            ← Home, AddEntry, History
│   │   ├── 📂 supervisor/         ← Dashboard, Students list
│   │   └── 📂 admin/              ← System overview, Manage Supervisors
│   │
│   ├── 📂 types/                  ← Global TypeScript interfaces
│   └── 📂 utils/
│       └── theme.ts               ← Base color dictionaries and spacing scales
│
├── 📂 __tests__/                  ← Jest & Testing Library suites
│
├── App.tsx                        ← App Entry Point
└── app.json                       ← Expo Configuration
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 22.x
- ITIER Backend running locally (see [Backend Repo](https://github.com/Ahmed-ElKashif/ITIER-study-tracker-backend))
- **Expo Go** app installed on your physical Android/iOS device (or Xcode/Android Studio for emulators)

### 1. Clone & Install

```bash
git clone https://github.com/Ahmed-ElKashif/ITIER-Front-End.git
cd ITIER-Front-End

npm install
```

### 2. Configure API Connection

Ensure the app points to your local backend. Open `src/api/client.ts` and set `API_BASE_URL` to your computer's local IP address (e.g., `192.168.1.x`) instead of `localhost`.

```typescript
// src/api/client.ts
export const API_BASE_URL = 'http://192.168.1.x:3000/api/v1';
```

### 3. Run the App

```bash
npx expo start
```
Scan the generated QR code using your phone's camera (iOS) or the Expo Go app (Android).

---

## 🔑 Demo Credentials

Ensure the backend has been seeded (`npx prisma db seed`). 

| Role       | Username           | Password      | Theme Color |
|------------|--------------------|---------------|-------------|
| 🛡️ Admin    | `ahmed_admin`      | `admin123`    | Gold        |
| 👩‍💼 Supervisor| `amira_supervisor` | `supervisor123`| Teal        |
| 🎓 Student  | `student1`         | `password123` | Crimson     |

> **Note:** New registrations are set to `PENDING_APPROVAL`. A supervisor must log in and approve the student before they can access the platform.

---

## 🗺️ Roadmap

| Phase | Timeline | Status |
|---|---|---|
| Phase 1 — Core App | Days 1-10 | ✅ Complete |
| Phase 2 — Role-Based UI | Days 11-12 | ✅ **Complete** |
| Phase 3 — E2E Testing | Days 13-14 | 🔜 Upcoming |
| Phase 4 — Production Build | Day 15 | 🔜 Upcoming |

---

## 👨‍💻 Author

<div align="center">

**Ahmed ElKashif**

ITP Front-End & Mobile Dev Track — Cohort R2 2026

Information Technology Institute (ITI) — Egypt

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Ahmed--ElKashif-181717?style=for-the-badge&logo=github)](https://github.com/Ahmed-ElKashif)

</div>

---

<div align="center">

**Built with ❤️ for ITI · Phase 2 Complete ✅**

*"Study hard, track smarter."*

</div>
