# itier User Guide

## For Students

### Getting Started

1. **Register**
   - Open the app
   - Tap "Register" on the login screen
   - Fill in: Full Name, Username, Email, Password
   - Your account is created as a Student
   - You'll be logged in automatically

2. **Login**
   - Enter your username and password
   - Tap "Login"

---

### Logging Study Time (Add Entry Tab)

1. Go to the **Add Entry** tab (pencil icon)
2. Quick-tap a subject button **or** type a custom subject
3. Enter the number of hours you studied (decimals allowed, e.g. `2.5`)
4. Tap the date field to select the study date (cannot select future dates)
5. Optionally add notes about your session
6. Tap **"Add Entry"** — you'll see a success message

---

### Viewing Your History (History Tab)

1. Go to the **History** tab (clock icon)
2. See all your past entries with subject, date, and hours
3. Your **Total Hours** and **Entry Count** are shown at the top
4. Pull down on the list to refresh
5. Tap the 🗑️ **Delete** button on any entry to remove it (confirmation required)

---

### Checking the Leaderboard (Leaderboard Tab)

1. Go to the **Leaderboard** tab (trophy icon)
2. **Daily** tab: Rankings for today's study hours
3. **Weekly** tab: Aggregated rankings for the current week
4. Your position is highlighted in blue
5. 🥇🥈🥉 Top 3 get trophy badges
6. Pull down to refresh rankings

---

### Home Screen

1. See your **Daily Quote** for motivation
2. View your **This Week** hours summary
3. View your **This Month** hours summary
4. Pull down to refresh all data

---

## For Supervisors

### Dashboard Tab

1. View your **track name** and total student count
2. See **Average Weekly Hours** per student
3. See the **Most Studied Subject** across the track
4. Pull down to refresh

---

### Students Tab

1. View all students in your track with their weekly/monthly hours
2. **Fire badge color** shows student activity level:
   - 🟢 Green = 20+ hours/week (Excellent)
   - 🔵 Blue = 10–19 hours/week (Good)
   - 🔴 Red = Under 10 hours/week (Needs attention)
3. Use the **search bar** to find a student by name or username
4. Tap a student card to see their full details (email, total hours, subject breakdown)

---

### Leaderboard Tab

- Same as student leaderboard, but shows the full track with supervisor color theme

---

## Tips & Tricks

- 📅 Log entries **daily** for the most accurate weekly/monthly stats
- 🔄 **Pull down** on any screen to refresh data from the server
- 🏆 Check the leaderboard to stay motivated and competitive
- 📝 Use notes to track what you specifically worked on in each session

---

## Troubleshooting

**Can't login?**
- Double-check your username (not email) and password
- Make sure the backend server is running (`npm run dev`)

**Entries not showing?**
- Pull down to refresh the History screen
- Check your internet/network connection to the server

**Leaderboard is empty?**
- You need at least one entry for today (Daily) or this week (Weekly)
- Pull to refresh after adding an entry

**App won't connect to server?**
- Ensure the backend is running on port 3000
- Open `src/api/client.ts` and replace the `API_BASE_URL` with your computer's local IP (e.g. `192.168.1.5`)
- Both your phone (running Expo Go) and your PC must be connected to the exact same WiFi network
