# itier — Demo Script

## Pre-Demo Checklist

- [ ] Backend server running (`npm run dev` in `study-tracker-backend/`)
- [ ] Database seeded with demo data (`npx prisma db seed`)
- [ ] Expo Go app installed on your phone
- [ ] App running via Expo (`npx expo start` in `ITIER-Front-End/`)
- [ ] App logged out (clean state)

---

## Demo Flow (~10 minutes)

### Part 1: Student Experience (5 minutes)

**1. Login (30 sec)**
- Show the login screen (branding: "itier")
- Demo credentials hint visible at the bottom
- Login as `student1 / password123`
- App navigates to the Student tabs

**2. Home Screen (45 sec)**
- Show the **daily motivational quote** at the top
- Point out **This Week** and **This Month** study hour summaries
- Pull down to demonstrate live refresh
- Say: *"Students get a personalized dashboard every time they open the app"*

**3. Add Entry (1 min)**
- Navigate to **Add Entry** tab
- Quick-tap **"React Native"** subject button — field fills instantly
- Type `2.5` in the Hours field
- Show the date picker — note "cannot select future dates" validation
- Add note: `"Completed navigation workshop"`
- Tap **"Add Entry"** — success alert appears, form clears

**4. History (1 min)**
- Navigate to **History** tab
- Show the new entry at the top of the list
- Point out **Total Hours** and **Entry Count** updated
- Demonstrate pull-to-refresh
- Tap **Delete** on an entry → confirm dialog → entry removed, stats update

**5. Leaderboard (1 min)**
- Navigate to **Leaderboard** tab
- Show **Daily** rankings — point out current user highlighted in blue
- Show 🥇🥈🥉 trophy badges for top 3
- Switch to **Weekly** tab
- Say: *"Rankings update live as students log their hours"*

**6. Logout (15 sec)**
- Tap the logout icon in the header
- Confirm logout
- App returns to login screen

---

### Part 2: Supervisor Experience (5 minutes)

**1. Login (30 sec)**
- Login as `supervisor1 / password123`
- App navigates to Supervisor tabs (green theme — distinct from student blue)

**2. Dashboard (1 min)**
- Show **track name** and **total student count**
- Point out **Average Weekly Hours** — *"Track-level KPI at a glance"*
- Show **Most Studied Subject** across the track
- Demonstrate pull-to-refresh

**3. Students List (2 min)**
- Navigate to **Students** tab
- Show the full list of students with activity badges:
  - 🟢 Green fire = 20+ hrs/week
  - 🔵 Blue fire = 10–19 hrs/week
  - 🔴 Red fire = under 10 hrs/week
- Use the **search bar** — type part of a name to filter instantly
- Tap a student card → Alert shows detailed analytics:
  - Total hours, total entries
  - Subject-by-subject hour breakdown

**4. Supervisor Leaderboard (1 min)**
- Navigate to **Leaderboard** tab
- Show same rankings as students, with supervisor green theme
- Say: *"Supervisors can monitor competitive engagement across the whole track"*

**5. Summary (30 sec)**
- Recap:
  - *"Role-based access — students see their own data, supervisors see the full track"*
  - *"Real-time leaderboard creates healthy competition"*
  - *"Clean TypeScript codebase, Prisma ORM, JWT authentication"*

---

## Key Talking Points

| Feature | Value |
|---|---|
| Mobile-first | Built for on-the-go daily tracking |
| Real-time | Leaderboard refreshes on demand |
| Role-based | Student vs. Supervisor views — same app |
| Motivational | Daily quotes + competitive rankings |
| Secure | JWT auth, bcrypt hashing, token expiry handling |
| Type-safe | Full TypeScript frontend & backend |

---

## Q&A Preparation

**Q: Can students see each other's data?**
A: Only on the leaderboard (name + hours). Private details like notes are never exposed.

**Q: How does the leaderboard work?**
A: The backend aggregates each student's hours per day/week and ranks them descending.

**Q: Can supervisors edit student data?**
A: Not in the MVP. It's a read-only analytics view. Editing is a planned future feature.

**Q: Is this production-ready?**
A: MVP-ready for ITI use. Future roadmap includes deployment, push notifications, and an instructor role.

**Q: What about security?**
A: JWT authentication with 7-day expiry, bcrypt password hashing, role-based route guards on both frontend and backend, automatic logout on token expiry.
