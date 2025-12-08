# DemoApp

ASP.NET Core 9 Web API + React (Vite + TypeScript) Todo application. This repo includes backend, frontend, Docker files, and a full deployment guide to Azure.

## Quick Links
- Full documentation (build → Docker → Azure): `docs/FULL_DOCUMENTATION.md`
- Backend Swagger (production): `https://backenddemoapp2025.azurewebsites.net/swagger`
- Frontend (production): `https://demoappfrontend.azurewebsites.net/`

## Run locally
Backend:
```bash
dotnet restore && dotnet run
```
Frontend:
```bash
cd frontend
npm install
# set VITE_API_BASE to your backend URL (no trailing slash)
npm run dev
```

## Docker quickstart
Backend:
```bash
docker build -t demoapp:latest .
docker run --rm -p 5000:80 demoapp:latest
```
Frontend:
```bash
cd frontend
# $env:VITE_API_BASE="http://localhost:5000"  (PowerShell) 
docker build -t demoapp-frontend:latest .
docker run --rm -p 3000:80 demoapp-frontend:latest
```

## Azure
- Push images to ACR and configure Azure Web App for Containers.
- Backend app settings: `FRONTEND_URL`, optional `EXTRA_CORS_ORIGINS`, `ConnectionStrings__DefaultConnection`.
- Frontend build env: `VITE_API_BASE=https://<your-backend-host>`

See `docs/FULL_DOCUMENTATION.md` for detailed steps and troubleshooting. 


