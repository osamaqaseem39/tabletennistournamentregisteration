# Development Setup Script for Table Tennis Registration System
# Run this script to set up the development environment

Write-Host "Setting up Table Tennis Registration System..." -ForegroundColor Green

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}
npm install
Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green

# Test frontend build
Write-Host "Testing frontend build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend build successful!" -ForegroundColor Green
} else {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Go back to root
Set-Location ..

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "node_modules") {
    Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}
npm install
Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green

# Go back to root
Set-Location ..

Write-Host "Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start development:" -ForegroundColor Cyan
Write-Host "  Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "  Backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "To test builds:" -ForegroundColor Cyan
Write-Host "  Frontend: cd frontend && npm run build" -ForegroundColor White
Write-Host "  Backend:  cd backend && npm start" -ForegroundColor White 