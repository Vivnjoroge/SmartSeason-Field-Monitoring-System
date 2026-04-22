# 🌱 SmartSeason: Field Monitoring System

SmartSeason is a premium, full-stack agricultural monitoring platform designed to streamline field coordination between administrators and field agents. It provides real-time tracking of crop stages, automated health alerts, and detailed field observation logs.

---

## 🚀 Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL with managed connections.
- **Authentication**: JWT-based role-based access control.

---

## 🛠️ Core Features

- **Multi-Role Dashboards**: Custom views for Admins (Global Overview) and Agents (Assigned Fields).
- **Field Lifecycle Management**: Track fields through `Planted`, `Growing`, `Ready`, and `Harvested` stages.
- **Visual Timelines**: Every update (stage change or note) is captured in a chronological vertical timeline.
- **Health Indicators**: Automated status determination based on real-time field data.

---

## ⚖️ Field Status Logic

The system automatically computes the operational status of every field to help coordinators prioritize their attention:

| Status | Logic / Condition |
| :--- | :--- |
| **✅ Active** | The default state for fields that are progressing normally and have been updated recently. |
| **⚠️ At Risk** | Triggered if a field exceeds **90 days** since planting (indicating slow progress) OR if **14 days** have passed without any update from the agent (stale data). |
| **🏁 Completed** | Automatically assigned once the field stage is set to **"Harvested"**. |

---

## 🏃 Getting Started

### 📦 Prerequisites
- Node.js (v18+)
- PostgreSQL instance running

### 🔌 Backend Setup
1. Navigate to `/backend`.
2. Run `npm install`.
3. Configure your `.env` file with `DATABASE_URL` and `JWT_SECRET`.
4. Initialize the database using `src/db/schema.sql` and optional `seed.sql`.
5. Run `npm run dev` to start the server.

### 💻 Frontend Setup
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Run `npm run dev` to start the Vite development server.

---

## 📁 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── controllers/   # API Logic
│   │   ├── services/      # Business Logic (Status Calculations)
│   │   ├── routes/        # API Endpoints
│   │   └── db/            # Schema & Seed data
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, StatusBadge)
│   │   ├── pages/         # View Definitions (Dashboards, Detail)
│   │   └── context/       # Auth & Global State
```

&copy; 2026 SmartSeason Team. Optimized Agriculture.
