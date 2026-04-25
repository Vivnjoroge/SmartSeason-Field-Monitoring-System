# SmartSeason: Field Monitoring System

SmartSeason is a premium, full-stack agricultural monitoring platform designed to streamline coordination between administrators and field agents. It provides real-time tracking of crop stages, health alerts, and detailed field observation logs.

---

## Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (Supabase).
- **Authentication**: JWT-based role-based access control.

---

## Core Features

- **Multi-Role Dashboards**: Custom views for Administrators (Global Overview) and Agents (Assigned Fields).
- **Field Lifecycle Management**: Track fields through Planted, Growing, Ready, and Harvested stages.
- **Visual Timelines**: Detailed chronological logs for every stage change or observation note.
- **Automated Health Indicators**: Real-time status determination based on update frequency and crop age.

---

## Field Status Logic

The system dynamically computes the operational status of every field on the backend. This ensures that "At Risk" alerts are triggered by time elapsed, even if no new data is entered.

### Status Definitions

| Status | Condition | UI Indicator |
| :--- | :--- | :--- |
| **Active** | Default state for fields with recent updates. | Forest Green |
| **At Risk** | Triggered if `days_since_planting > 90` OR `days_since_update > 14`. | Amber / Gold |
| **Completed** | Set automatically when the field stage is `Harvested`. | Slate Grey |

### Technical Implementation

- **Service Layer**: Logic is centralized in `backend/src/services/fieldService.js`.
- **Dynamic Enrichment**: Status is not stored in the database. The backend enriches field objects during API retrieval, ensuring data is always current based on the server time.
- **Data Dependency**: Utilizes `planting_date` and the most recent `created_at` timestamp from field updates.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance (Supabase recommended)

### Backend Setup
1. Navigate to `/backend`.
2. Run `npm install`.
3. Configure `.env` with `DATABASE_URL` and `JWT_SECRET`.
4. Run `npm run dev` to start the server.

### Frontend Setup
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Configure `VITE_API_BASE_URL` in your environment.
4. Run `npm run dev` to start the development server.

---

## Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── controllers/   # API Logic
│   │   ├── services/      # Business Logic (Status Calculations)
│   │   ├── routes/        # API Endpoints
│   │   └── db/            # Schema & Configuration
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI Components
│   │   ├── pages/         # Dashboard and Detail Views
│   │   └── context/       # Auth & State Management
```

&copy; 2026 SmartSeason. Optimized Agriculture.
