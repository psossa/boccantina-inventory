# Boccantina Inventory Management

A full-stack inventory management system for Boccantina Cantina de Vinos — a restaurant/bar environment for tracking food inventory on a weekly basis and ordering supply requests in real time.

## Features

- **Real-time Stock Adjustments** — Tap +/- to record additions/withdrawals during active service
- **Automated Reorder Alerts** — Threshold-based alerts when stock falls below minimum
- **Weekly Inventory Sheet** — Excel-like table with daily tracking and cost calculations
- **Drag-and-Drop Kanban** — Supply task management with native HTML5 drag API
- **Supply Request Form** — Multi-item orders with category dropdowns and cost projections
- **Monthly Expenditure Reports** — SVG bar charts and category breakdowns
- **Barcode Scanner** — Camera-based scanning with manual fallback
- **Cloud Sync** — Node.js + MongoDB backend with JWT authentication
- **Mobile Responsive** — Bottom navigation on mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (no framework) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/boccantina-inventory.git
cd boccantina-inventory
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed    # One-time: creates admin user + sample data
npm run dev     # Starts on port 5000
```

### 3. Frontend Setup

```bash
cd ..
npm install
# Copy your logo to public folder:
cp /path/to/LOGO-MED.png public/LOGO-MED.png
npm run dev     # Starts on port 5173
```

### 4. Login

- Username: `admin`
- Password: `admin`

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Render)
```bash
cd server
# Set env vars: MONGODB_URI, JWT_SECRET, PORT
npm start
```

Update `src/api/api.js` with your production API URL.

## Project Structure

```
boccantina-inventory/
├── public/                 # Static assets (logo)
├── src/
│   ├── api/               # API service layer
│   ├── components/        # React components
│   ├── context/           # AppContext (state management)
│   ├── data/              # Initial seed data
│   ├── App.jsx            # Main router
│   ├── index.css          # All styles
│   └── main.jsx           # Entry point
├── server/
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── middleware/        # JWT auth
│   ├── server.js          # Entry point
│   ├── seed.js            # Database seeder
│   └── .env               # Environment variables
├── package.json
├── vite.config.js
└── README.md
```

## License

MIT
