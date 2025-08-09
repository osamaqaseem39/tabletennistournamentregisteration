# Deployment Guide for Table Tennis Registration System

## Vercel Deployment

This project is configured for deployment on Vercel as a monorepo with separate frontend and backend services.

### Project Structure
```
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── vercel.json        # Root Vercel configuration
└── DEPLOYMENT.md      # This file
```

### Deployment Steps

1. **Connect to Vercel**
   - Push your code to GitHub/GitLab
   - Connect your repository to Vercel
   - Vercel will automatically detect the monorepo structure

2. **Build Configuration**
   - **Frontend**: Automatically builds from `frontend/` directory
   - **Backend**: Deploys as serverless function from `backend/server.js`
   - Build command: `npm run build` (runs in frontend directory)
   - Output directory: `build/`

3. **Environment Variables**
   Set these in your Vercel dashboard:
   
   **Backend:**
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or let Vercel assign)
   - `CORS_ORIGIN`: Your frontend URL
   - Database connection strings (if using external DB)
   
   **Frontend:**
   - `REACT_APP_API_URL`: Your backend API URL

4. **API Routes**
   - Backend API: `/api/*` routes to backend server
   - Frontend: All other routes serve the React app

### Troubleshooting

**Build Errors:**
- Ensure `frontend/package.json` has a `build` script
- Check that all dependencies are properly installed
- Verify Node.js version compatibility (use Node 18+)

**Module Resolution Issues:**
- The error with `ajv` modules indicates dependency conflicts
- Solution: Clean install dependencies in each directory separately

**Deployment Issues:**
- Frontend builds from `frontend/` directory
- Backend deploys as serverless function
- Check Vercel build logs for specific error messages

### Local Testing

Before deploying, test locally:
```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd backend
npm install
npm start
```

### Vercel Dashboard Settings

- **Framework Preset**: Other
- **Build Command**: Leave empty (handled by vercel.json)
- **Output Directory**: Leave empty (handled by vercel.json)
- **Install Command**: Leave empty (handled by vercel.json) 