# Family Tree Builder

Interactive web application for creating family trees with drag-and-drop functionality and infinite canvas.

## Features

- Three interaction modes: Navigate, Add Person, Connect
- Infinite pannable/zoomable canvas with coordinate transformation
- Drag-to-connect relationship creation (Parent/Spouse/Child)
- Form-based person creation with optional fields
- Double-click editing with confirmation dialogs
- Auto-save to localStorage with JSON export/import
- Grid snapping and return-to-origin functionality

## Installation

```bash
npm install
npm start
```

## Usage

**Navigate Mode**: Pan canvas with drag/scroll, reposition people, double-click to edit
**Add Person Mode**: Click canvas to create new person, drag to reposition  
**Connect Mode**: Drag between people to create relationships

**Controls**: 
- Scroll: zoom
- Drag: pan canvas or move people
- Ctrl+Scroll: pan
- Double-click: edit person

## Architecture

- React 18 with TypeScript
- Functional components with hooks
- Render props pattern for canvas state sharing
- SVG for relationship lines
- CSS3 with flexbox/grid layouts
- LocalStorage persistence

## Project Structure

```
src/
├── App.tsx                 # Main application
├── types.ts                # TypeScript interfaces
├── FamilyTreeCanvas.tsx    # Canvas with mode management
├── InteractiveCanvas.tsx   # Pan/zoom wrapper
├── PersonNode.tsx          # Person display/edit
├── PersonForm.tsx          # Person creation form
├── ConnectionLine.tsx      # SVG relationship lines
└── storage.ts              # Data persistence
```

## Technical Implementation

- Coordinate transformation for zoom/pan accuracy
- Event delegation for drag-and-drop
- Global mouse event handling for connection completion
- Modal overlays with form validation
- Data attributes for drag target detection