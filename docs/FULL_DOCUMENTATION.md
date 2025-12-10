# DemoApp — Full Documentation (Build to Successful Deployment)

This document captures the end-to-end journey of creating, running, containerizing, and deploying the DemoApp application (ASP.NET Core 9 Web API + React/Vite frontend) to Azure, including critical configuration such as CORS and Azure SQL.

## Table of Contents
- Overview and Architecture
- Backend (ASP.NET Core Web API)
- Frontend (React + Vite + TypeScript + Emotion + React Query)
- Local Development
- Dockerization (backend and frontend)
- Azure Deployment
  - Azure Container Registry (ACR)
  - Azure Web App for Containers (backend)
  - Azure Static Web Apps or Web App (frontend)
  - Azure SQL (managed database)
- Environment Variables
- CORS Configuration (final working setup)
- Commands Reference
- Troubleshooting (CORS, Ports, HTTPS redirect, Vite env, SQL Firewall)

---

## Overview and Architecture

- Backend: ASP.NET Core 9 Web API with Entity Framework Core (SQL Server provider).
- Frontend: React 19 + Vite + TypeScript, UI styled with Emotion, data layer via React Query, animations with Framer Motion.
- Database: Azure SQL (managed service).
- Containerization: Docker multi-stage images; backend served on ASP.NET runtime; frontend built and served via NGINX.
- Hosting:
  - Backend container image stored in ACR, pulled by Azure Web App for Containers.
  - Frontend hosted as static site (Azure Web App, Static Web Apps, or NGINX container).

### Directory Structure (key parts)
- `Program.cs` (backend entry)
- `Controllers/TodoController.cs` (CRUD endpoints)
- `Data/AppDbContext.cs`, `Models/TodoItem.cs`
- `Dockerfile` (backend)
- `docker-compose.yml` (local composition)
- `frontend/` (Vite application)
  - `src/components/*`, `src/hooks/useTodos.ts`, `src/services/api.ts`, `src/types/*`
  - `Dockerfile`, `nginx.conf`

---

## Backend (ASP.NET Core Web API)

### Core points
- Uses EF Core with SQL Server provider.
- Auto-migrates database on boot using `Database.Migrate()` with retry logic.
- Exposes endpoints:
  - `GET /api/todo`
  - `GET /api/todo/{id}`
  - `POST /api/todo`
  - `PUT /api/todo/{id}`
  - `DELETE /api/todo/{id}`
- Swagger always enabled for demo at `/swagger`.

### Final working CORS configuration (Program.cs)
- Deterministic, policy-based, and ordered correctly in the middleware.
- Allows the production frontend and local dev origins.

```csharp
// Read allowed frontend origin from config (App Settings in Azure)
var frontendUrl = builder.Configuration["FRONTEND_URL"] 
                  ?? "https://demoappfrontend.azurewebsites.net";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins(frontendUrl,
                           "https://demoappfrontend.azurewebsites.net",
                           "http://localhost:5173",
                           "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger for demo
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DemoApp v1");
    c.RoutePrefix = "swagger";
});

// DB migrate with retries (omitted here for brevity)

// Optional: only redirect outside Development, if TLS terminates in front
app.UseHttpsRedirection();

// CORS must be before auth/endpoints
app.UseCors("AllowFrontendApp");

app.UseAuthorization();
app.MapControllers();
app.Run();
```

---

## Frontend (React + Vite + TypeScript)

### Tech choices
- React 19 + Vite 7 + TypeScript strict.
- Styling with Emotion.
- Data fetching/mutations with React Query.
- Animations with Framer Motion.
- API service (`src/services/api.ts`) uses Axios, with configurable base URL:

```ts
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
```

Build-time environment variable required: `VITE_API_BASE`.

### Features implemented
- Add todos.
- Toggle completion.
- Inline edit (click to edit, Enter/Escape).
- Delete todo.
- Filters: All / Active / Completed.
- Loading/error states via React Query.
- Responsive and accessible.

---

## Local Development

### Prerequisites
- Node.js >= 20.19 (you used v24.x)
- .NET 9 SDK
- Docker Desktop (optional but recommended)

### Backend (local)
```bash
dotnet restore
dotnet build
dotnet run
# available on http://localhost:5000 (if using docker-compose mapping) 
# or http://localhost:5xxx from Kestrel if running directly
```
Ensure your `appsettings.json` has a valid connection string or use Azure SQL connection in User Secrets or environment variables.

### Frontend (local)
```bash
cd frontend
npm install
# For local backend (compose exposes 5000)
set VITE_API_BASE=http://localhost:5000   # PowerShell (Windows)
# export VITE_API_BASE=http://localhost:5000  # bash/zsh
npm run dev
# open http://localhost:5173
```

---

## Dockerization

### Backend image
Build and test locally:
```bash
docker build -t demoapp:latest .
docker run --rm -p 5000:80 --name demoapp-web demoapp:latest
```

### Frontend image
From `frontend/`:
```bash
# Ensure the correct API base is baked at build time
# (Vite embeds env during build)
# PowerShell:
$env:VITE_API_BASE="https://backenddemoapp2025.azurewebsites.net"
docker build -t demoapp-frontend:latest .
docker run --rm -p 3000:80 --name demoapp-frontend demoapp-frontend:latest
```

### docker-compose (local convenience)
The compose file maps web `80 -> 5000` and runs SQL locally (optional). For Azure SQL, remove the db service and set the Azure connection string on the web service.

---

## Azure Deployment

### Azure Container Registry (ACR)
```bash
az login
az acr login --name demoappacr2025
docker tag demoapp:latest demoappacr2025.azurecr.io/demoapp:latest
docker push demoappacr2025.azurecr.io/demoapp:latest

docker tag demoapp-frontend:latest demoappacr2025.azurecr.io/demoapp-frontend:latest
docker push demoappacr2025.azurecr.io/demoapp-frontend:latest
```

### Azure Web App for Containers (backend)
Configure to pull `demoappacr2025.azurecr.io/demoapp:latest`. In App Settings:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection=<Azure SQL connection string>`
- `FRONTEND_URL=https://demoappfrontend.azurewebsites.net`
- (optional local dev) `EXTRA_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`

Restart the Web App after saving.

### Frontend hosting
Options:
- Azure Web App (static): deploy `frontend/dist` to a static web host.
- Azure Static Web Apps.
- NGINX container (push to ACR, run in Web App for Containers).

Critical: Set `VITE_API_BASE=https://backenddemoapp2025.azurewebsites.net` before `npm run build`.

---

## Environment Variables

- Backend:
  - `ConnectionStrings__DefaultConnection` — Azure SQL.
  - `FRONTEND_URL` — primary allowed frontend origin.
  - `EXTRA_CORS_ORIGINS` — optional comma-separated list for local/dev.
  - `ASPNETCORE_ENVIRONMENT` — `Production` in Azure.
  - `ASPNETCORE_URLS` — `http://+:80` when containerized (if needed).

- Frontend:
  - `VITE_API_BASE` — point to backend URL (no trailing slash).

---

## CORS Configuration (final)

- Allow exactly the frontend origin(s). No trailing slash; correct scheme (`https`).
- Put `app.UseCors(...)` before `MapControllers()`.
- If using Azure’s platform CORS, disable it and manage CORS in code (to avoid conflicts).
- To debug: temporarily allow any origin; then revert to strict origins.

---

## Commands Reference

### Build & run locally
```bash
dotnet run
cd frontend && npm run dev
```

### Docker build/push
```bash
# backend
docker build -t demoapp:latest .
docker tag demoapp:latest demoappacr2025.azurecr.io/demoapp:latest
docker push demoappacr2025.azurecr.io/demoapp:latest

# frontend
cd frontend
$env:VITE_API_BASE="https://backenddemoapp2025.azurewebsites.net"
docker build -t demoapp-frontend:latest .
docker tag demoapp-frontend:latest demoappacr2025.azurecr.io/demoapp-frontend:latest
docker push demoappacr2025.azurecr.io/demoapp-frontend:latest
```

---

## Troubleshooting

- CORS blocked:
  - Ensure `FRONTEND_URL` matches exactly your site origin (e.g., `https://demoappfrontend.azurewebsites.net`), and includes local dev origins as needed.
  - Confirm `Access-Control-Allow-Origin` in response headers using:
    ```bash
    curl -i -H "Origin: https://demoappfrontend.azurewebsites.net" https://backenddemoapp2025.azurewebsites.net/api/todo
    ```
  - Place `UseCors` before `MapControllers`. Avoid Azure platform CORS if using code CORS.

- API path errors:
  - Use `VITE_API_BASE` with no trailing slash. API paths should start with `/api/...`.

- HTTPS redirect loops / FAILED to determine https port:
  - In containers, consider gating `UseHttpsRedirection()` to non-development only, or terminate TLS at the ingress.

- Azure SQL connectivity:
  - Add Web App outbound IPs to SQL Server firewall or enable “Allow Azure services”.
  - Keep `Encrypt=True;TrustServerCertificate=False`.

- Vite env changes not applied:
  - Rebuild the frontend after changing `VITE_API_BASE`. Vite embeds env at build time.

---

## What changed during the journey
- Frontend stack built with Vite + TS + Emotion + React Query; API paths made configurable via `VITE_API_BASE`.
- Backend CORS evolved from hard-coded to environment-driven to a final simple/strict policy.
- Docker images created for both backend and frontend; pushed to ACR.
- Azure deployment finalized with correct environment variables and CORS configuration.

---

Links:
- Frontend (production): `https://demoappfrontend.azurewebsites.net/`
- Backend Swagger: `https://backenddemoapp2025.azurewebsites.net/swagger`


