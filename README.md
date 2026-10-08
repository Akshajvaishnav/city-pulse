# 🏙️ SmartCity Infrastructure Flaw Detection & Incident Lifecycle System

A modern full-stack web application designed for smart cities and municipal corporations to detect, classify, prioritize, track, and resolve urban infrastructure defects (potholes, damaged roads, broken street lights, garbage overflows, water leaks, and damaged traffic signage) using **Computer Vision (AI)**, **Geospatial GIS Mapping**, and **Municipal Workflow Automation**.

---

## 🌐 Quick Localhost Access Links

When running locally, access the system through these endpoints:

- 🖥️ **Web Dashboard & Application**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend REST API**: [http://localhost:8000](http://localhost:8000)
- 📖 **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 📑 **ReDoc API Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- 🗺️ **Live GIS Map Telemetry Feed**: [http://localhost:8000/api/issues/map](http://localhost:8000/api/issues/map)
- 📊 **City Analytics KPI Endpoint**: [http://localhost:8000/api/statistics](http://localhost:8000/api/statistics)

---

## 🚀 Key Features

- **End-to-End Operational Lifecycle**:
  $$\text{Detect} \longrightarrow \text{Locate} \longrightarrow \text{Classify} \longrightarrow \text{Prioritize} \longrightarrow \text{Report} \longrightarrow \text{Monitor} \longrightarrow \text{Resolve}$$
- **AI Computer Vision Defect Scanner**:
  - Image defect detection with bounding box localization overlays.
  - Automatic confidence score calculation, defect classification, and severity urgency scoring.
  - Side-by-side view: **Original Photograph** vs **AI-Annotated Overlay**.
  - Modular AI architecture with pluggable `BaseDefectDetector` ready for Ultralytics YOLOv8/YOLOv11 model weights.
- **Interactive Geospatial Infrastructure Map**:
  - Full-featured Leaflet GIS map with color-coded severity markers (🔴 High/Pulsating, 🟡 Medium, 🟢 Low/Resolved).
  - Rich interactive popups with defect thumbnails, report reference IDs, and direct dossier links.
  - Multi-criteria filtering by flaw type, severity, workflow status, and sector search.
- **Citizen & Inspector Defect Reporting**:
  - Image upload with instant AI Pre-Scan (auto-suggests flaw type, confidence, severity, and incident description).
  - Interactive click-to-pin location selector map, preset city hotspots, and live GPS geolocation.
  - Automatic sequential Report ID generation (e.g. `SC-2026-00125`).
- **Administrative Operations Command Dashboard**:
  - Real-time KPI cards: Total Reported, Pending Action, In Progress, Resolved, High Priority, and Detected Today.
  - Interactive Chart.js analytics: Defect Distribution Doughnut, Severity Breakdown Bar, and 7-Day Velocity Trend lines.
  - Recent incident telemetry feed.
- **Issue Lifecycle Management & Audit Timeline**:
  - Searchable, filterable management table with CSV export.
  - Role-based workflow status transitions: `Pending` $\rightarrow$ `Verified` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Rejected`.
  - Immutable status transition history timeline tracking officer names, timestamps, and maintenance notes.
- **City Intelligence Analytics**:
  - Prevalent defect taxonomy breakdown, hotspot sector distribution, SLA turnaround times, and resolution rates.
  - Printable / exportable civic infrastructure health summaries.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend UI** | **React 19 + Vite** | High-performance SPA with fast HMR |
| **Styling** | **Tailwind CSS v4 + Vanilla CSS** | Modern civic tech dark mode, glassmorphism, responsive tokens |
| **Icons** | **Lucide React** | Consistent SVG iconography |
| **GIS Mapping** | **Leaflet & React-Leaflet** | Interactive geospatial maps with custom SVG radar pins |
| **Visualizations** | **Chart.js & React-Chartjs-2** | Doughnut, Bar, and Line analytical charts |
| **Backend Framework** | **Python 3 FastAPI** | High-speed asynchronous REST API with automatic OpenAPI docs |
| **Database ORM** | **SQLAlchemy 2.0** | Object-relational mapping (SQLite default; PostgreSQL ready) |
| **Data Validation** | **Pydantic v2** | Strict schema validation |
| **AI / Computer Vision** | **Modular Pillow & YOLO Adapter** | Heuristic CV localization with pluggable YOLOv8 engine |
| **Authentication** | **JWT / Python-Jose** | Municipal administrative authentication |

---

## 📂 Project Structure

```
City Heart/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app, CORS, static routes, startup seeding
│   │   ├── config.py            # Environment configurations and secrets
│   │   ├── database.py          # SQLAlchemy session & DB engine setup
│   │   ├── models.py            # InfrastructureIssue, StatusHistory, User models
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── seed_data.py         # Realistic Smart City seed data & sample image generator
│   │   ├── api/                 # REST API Routers
│   │   │   ├── __init__.py
│   │   │   ├── detect.py        # POST /api/detect (AI image processing)
│   │   │   ├── issues.py        # CRUD /api/issues, /api/issues/map, status updates
│   │   │   ├── statistics.py    # GET /api/statistics (KPI aggregations)
│   │   │   └── auth.py          # POST /api/auth/login, /api/auth/me
│   │   ├── ai/                  # Computer Vision Subsystem
│   │   │   ├── __init__.py      # get_detector() singleton factory
│   │   │   ├── detector_base.py # Abstract Base Class BaseDefectDetector
│   │   │   ├── mock_detector.py # CV engine with Pillow HUD annotation drawing
│   │   │   └── yolo_adapter.py  # Production YOLOv8 / YOLOv11 adapter
│   │   └── services/
│   │       ├── __init__.py
│   │       └── issue_service.py # Issue business logic & KPI aggregation
│   ├── uploads/                 # Storage for user-uploaded & annotated images
│   ├── requirements.txt
│   └── run.py                   # Backend entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # App root, page routing, global modal integration
│   │   ├── index.css            # Tailwind styles, glassmorphism, map themes
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Admin authentication state
│   │   │   └── IssueContext.jsx # Global data cache, toasts, active modal state
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Responsive header with live tab indicators
│   │   │   ├── Footer.jsx       # Municipal civic footer
│   │   │   ├── LeafletMap.jsx   # Interactive GIS map with severity radar pins
│   │   │   ├── LocationPickerMap.jsx # Click-to-pin coordinate picker
│   │   │   ├── BoundingBoxCanvas.jsx # SVG bounding box renderer
│   │   │   ├── IssueDetailsModal.jsx # Comprehensive incident dossier & timeline
│   │   │   ├── StatusUpdateModal.jsx # Status transition modal
│   │   │   ├── StatsCard.jsx    # Metric card widget
│   │   │   ├── StatusBadge.jsx  # Workflow status pill
│   │   │   ├── SeverityBadge.jsx# High / Medium / Low urgency indicator
│   │   │   ├── DefectIcon.jsx   # Flaw type icon mapper
│   │   │   └── Toast.jsx        # Floating alert notifications
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero, statistics, pipeline, defect taxonomy
│   │   │   ├── DashboardPage.jsx# Central operations command & charts
│   │   │   ├── ReportIssuePage.jsx # AI-assisted report submission form
│   │   │   ├── AIDetectionPage.jsx # Computer vision scanning playground
│   │   │   ├── InfrastructureMapPage.jsx # Fullscreen GIS map
│   │   │   ├── IssueManagementPage.jsx   # Admin table with CSV export
│   │   │   ├── AnalyticsPage.jsx# City intelligence charts & summaries
│   │   │   └── LoginPage.jsx    # Admin login interface
│   │   └── services/
│   │       └── api.js           # Frontend API client
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
└── README.md
```

---

## ⚡ How to Run the Application

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
*Backend runs on `http://localhost:8000` (API Docs available at `http://localhost:8000/docs`).*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔐 Demo Credentials

To access authorized municipal features (status overrides, technician notes):

- **Username**: `admin@smartcity.gov`
- **Password**: `cityadmin2026`
- *(A one-click "Fill Credentials" button is provided on the Login page)*

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/detect` | Uploads image and executes AI computer vision detection |
| `POST` | `/api/issues` | Registers a new defect report (generates sequential `SC-2026-XXXXX` ID) |
| `GET` | `/api/issues` | Lists defect reports with filtering (`defect_type`, `severity`, `status`, `search`) |
| `GET` | `/api/issues/{id}` | Retrieves full dossier including chronological audit timeline |
| `PUT` | `/api/issues/{id}/status` | Updates workflow status (`Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`) |
| `DELETE` | `/api/issues/{id}` | Deletes a report from registry |
| `GET` | `/api/issues/map` | Returns lightweight geospatial coordinates for Leaflet mapping |
| `GET` | `/api/statistics` | Returns aggregated citywide KPI metrics and charts data |
| `POST` | `/api/auth/login` | Authenticates administrator credentials and issues token |
| `GET` | `/api/health` | Service health status |

---

## 🗄️ Database Schema

### `infrastructure_issues`
- `id` (INTEGER, Primary Key)
- `report_id` (VARCHAR, Unique, Indexed) e.g. `SC-2026-00101`
- `defect_type` (VARCHAR) e.g. `Pothole`, `Road Damage`, `Broken Street Light`, `Garbage Overflow`
- `image_url` (VARCHAR)
- `annotated_image_url` (VARCHAR, Nullable)
- `description` (TEXT)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `location_name` (VARCHAR)
- `severity` (VARCHAR) — `High`, `Medium`, `Low`
- `confidence` (FLOAT) — `0.0` to `1.0`
- `status` (VARCHAR) — `Pending`, `Verified`, `In Progress`, `Resolved`, `Rejected`
- `reported_by` (VARCHAR)
- `reporter_contact` (VARCHAR, Nullable)
- `ai_detected` (BOOLEAN)
- `bounding_boxes_json` (TEXT)
- `resolution_notes` (TEXT, Nullable)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### `status_history`
- `id` (INTEGER, Primary Key)
- `issue_id` (INTEGER, Foreign Key $\rightarrow$ `infrastructure_issues.id`)
- `old_status` (VARCHAR, Nullable)
- `new_status` (VARCHAR)
- `changed_by` (VARCHAR)
- `notes` (TEXT, Nullable)
- `timestamp` (DATETIME)

---

## 🧠 AI Computer Vision Architecture & YOLOv8 Drop-in Guide

The AI subsystem follows an extensible Strategy Pattern:
1. `BaseDefectDetector` in [detector_base.py](file:///Users/akshajvaishnav/City%20Heart/backend/app/ai/detector_base.py) defines the contract for all detectors.
2. `MockDefectDetector` in [mock_detector.py](file:///Users/akshajvaishnav/City%20Heart/backend/app/ai/mock_detector.py) provides intelligent defect recognition, realistic confidence jitter, and Pillow HUD bounding box drawing.
3. `YOLOv8DefectDetector` in [yolo_adapter.py](file:///Users/akshajvaishnav/City%20Heart/backend/app/ai/yolo_adapter.py) is pre-built to run real Ultralytics YOLO models.

### To Activate a Real YOLO Model:
1. Install ultralytics in backend venv:
   ```bash
   pip install ultralytics
   ```
2. Place custom-trained model weights at: `backend/models/yolov8_infrastructure.pt`
3. Set environment variable:
   ```bash
   export AI_DETECTION_MODE=yolo
   ```
4. Restart backend. The application will seamlessly execute real neural network inference!

---

## 🔮 Future Expansion
- Automated CCTV video stream frame-grabbing
- Mobile Flutter / React Native citizen companion app
- IoT road vibration and acoustic leak sensors
- Automated email and WhatsApp push alerts to citizens upon defect resolution
- Multi-city tenant partitioning
