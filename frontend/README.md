# Todo Frontend App (React + TypeScript + Emotion)

A modern, minimalist, accessible Todo app. Consumes a .NET 9+ REST API (see backend) and features add/edit/complete/delete/filter with instant feedback, optimized state, and smooth animations.

## Features
- Add, view, edit, complete, and delete todos
- Filter: all, active, completed
- Fast and resilient: React Query caching, no user-blocking load state
- Modern UI (Emotion CSS-in-JS, Framer Motion for animation)
- Responsive and a11y-focused by design
- Environment-based API URL (default: `http://localhost:5000`)

## Getting Started

```bash
npm install
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Backend must be running and accessible (edit `.env` or use VITE_API_BASE if needed).

## Configuration
Create a `.env` file in `/frontend` with:

```
VITE_API_BASE=http://localhost:5000
```

## File Structure
- `src/types/` — type defs (`TodoItem`)
- `src/services/` — API abstraction
- `src/hooks/` — React Query custom hooks
- `src/components/` — all UI components

## Dependencies
- React, TypeScript, Vite
- @emotion/react, @emotion/styled
- @tanstack/react-query
- framer-motion

---
MIT License
