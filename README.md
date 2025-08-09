# Table Tennis Tournament Registration System

A full-stack web application for managing table tennis tournament registrations.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
└── README.md         # This file
```

## Frontend (React)

The frontend is a React application built with Create React App.

### Local Development
```bash
cd frontend
npm install
npm start
```

### Deployment
The frontend is configured for Vercel deployment with `frontend/vercel.json`.

## Backend (Node.js/Express)

The backend is a Node.js API built with Express.

### Local Development
```bash
cd backend
npm install
npm run dev
```

### Deployment
The backend is configured for Vercel deployment with `backend/vercel.json`.

## Deployment Notes

- **Frontend**: Deploy to Vercel using the `frontend/` directory
- **Backend**: Deploy to Vercel using the `backend/` directory
- Each service has its own Vercel configuration
- Environment variables should be set in Vercel dashboard

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Frontend URL for CORS
- Database connection variables (if using external DB)

### Frontend
- `REACT_APP_API_URL`: Backend API URL 