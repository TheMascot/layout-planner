# Layout Planner

Layout Planner is a browser-based planning tool for airport aprons and hangars.  
Its goal is to help planners place aircraft and other ground vehicles on scaled surfaces, visualize occupancy, and make safer space-allocation decisions.

## Vision

The app is designed around real airside layout questions:
- How many aircraft/vehicles fit on a surface?
- Are required safety distances respected?
- Where are overlap conflicts?
- How does occupancy evolve over time when operations are scheduled?

## Core concepts

- **Surface**: A scaled operational area (for example an apron section or hangar floor).
- **Object**: A placeable entity (aircraft, helicopter, service vehicle, or generic rectangle).
- **Safety distance**: Buffer zone around an object for clearance planning.
- **Occupancy**: The set of objects currently present on one or more surfaces.
- **Timeline event**: A time-based appearance/disappearance rule for occupancy simulation.

## Working modes

1. **Static planning mode**  
   Design and validate layouts without date/time constraints.
2. **Time-aware planning mode (timeline)**  
   Explore how occupancy changes over time as objects appear/disappear.

## Feature status

| Area | Capability | Status |
| --- | --- | --- |
| Surface | Scale-based SVG workspace | Implemented |
| Surface | Grid visibility toggle | Implemented |
| Surface | Snap to grid toggle | Implemented |
| Surface | Multiple editable surfaces on one screen | Planned |
| Objects | Move objects on surface | Implemented |
| Objects | Safety zone visualization | Implemented |
| Objects | Overlap conflict highlighting | Implemented |
| Objects | Rotation editing/interaction | Planned |
| Objects | Collision detection with rotated geometry | Planned |
| Tools | Select mode | Implemented |
| Tools | Distance measuring mode | Implemented |
| Tools | Annotation mode (draw/select/delete) | Implemented |
| Persistence | Save/load layouts | Planned (UI placeholders exist) |
| Data | Load/save surfaces and models from database | Planned |
| Timeline | Time-aware occupancy playback | Planned |

## Current implementation snapshot

- Single-surface sample layout (`Kilo apron`) is loaded from local sample data.
- Objects are rendered as scaled rectangles and can be moved with optional snapping.
- Safety zones are drawn around each object.
- Object overlap is detected and highlighted in red.
- Tool cycle currently switches between `select`, `measure`, and `annotate`.
- Annotation controls include undo, delete-all, and delete-selected.
- Backend folder exists but API/database integration is not implemented yet.

## Tech stack

- **Frontend**: React 19 + TypeScript + Vite
- **Rendering**: SVG-based interactive canvas layers
- **State management**: React hooks and local component state
- **Tooling**: ESLint, TypeScript project references

## Project structure

```text
frontend/
  src/
    calculations/      # geometry, distance, overlap logic
    components/        # UI + canvas layers
    data/              # sample surfaces and objects
    hooks/             # tool interaction logic
    types/             # domain types and tool APIs
```

## Getting started

### Prerequisites

- Node.js 20+ recommended
- npm

### Install and run

```bash
npm install
npm run dev
```

### Available scripts

- `npm run dev` - start Vite development server
- `npm run build` - type-check and build production bundle
- `npm run lint` - run ESLint
- `npm run preview` - preview production build locally

## Roadmap focus

1. Database-backed catalog for aircraft/vehicle models and user-defined surfaces.
2. Save/load workflows for layouts.
3. Multi-surface planning in a single workspace.
4. Rotation-aware collision detection.
5. Timeline mode for time-based occupancy simulation.

## Notes

This repository currently contains the frontend prototype.  
As backend and persistence features are introduced, this README will be updated to include API and deployment details.
