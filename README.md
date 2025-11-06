# Kanban Board - Beautiful Project Management App

A stunning, fully-featured Kanban board application built for vibe coding. Organize your tasks with beautiful drag-and-drop interactions, smooth animations, and a modern UI design.

## ✨ Features

- **📋 Kanban Columns** - Default TODO, In Progress, and Completed columns with the ability to add custom columns
- **✏️ Task Management** - Add, edit, and delete tasks with titles and detailed descriptions/notes
- **🎯 Drag & Drop** - Smooth, delightful drag-and-drop to move tasks between columns or reorder within a column
- **💾 LocalStorage Persistence** - All your tasks and columns are automatically saved to browser local storage
- **🎨 Beautiful Design** - Modern UI with smooth animations, gradients, and thoughtful spacing
- **📱 Responsive Design** - Works beautifully on desktop, tablet, and mobile devices
- **⌨️ Keyboard Accessible** - Full keyboard navigation support
- **🚀 Fast & Performant** - Built with Next.js 15, React 19, and optimized rendering

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Drag & Drop**: @dnd-kit (modern, maintained)
- **Animations**: Framer Motion
- **State Management**: Zustand with localStorage persistence
- **Icons**: lucide-react
- **ID Generation**: uuid

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see your Kanban board.

## 🚀 Usage

### Adding a Task
1. Click "Add Task" in any column
2. Enter the task title (required)
3. Add an optional description/notes
4. Click "Add Task" to save

### Editing a Task
1. Hover over a task and click the edit (pencil) icon
2. Update the title or description
3. Click "Update Task" to save

### Deleting a Task
1. Hover over a task and click the delete (trash) icon
2. The task will be removed immediately

### Moving Tasks
1. Click and hold a task card
2. Drag it to another column or reorder within the same column
3. Release to drop the task in its new location

### Adding Custom Columns
1. Click the "Add Column" button at the end of the board
2. Enter a name for your new column
3. Click "Add Column" to create it

### Deleting Custom Columns
1. Hover over a custom column header
2. Click the trash icon
3. The column and all its tasks will be removed

## 💾 Data Persistence

All your tasks and columns are automatically saved to browser local storage. When you refresh the page or come back later, your board will be exactly as you left it.

**Note**: Data is stored per browser/device. Clearing your browser's local storage will delete all tasks.

## 🎨 Design Features

- **Beautiful Gradient Background** - Soft gradient from light gray to slightly darker gray
- **Smooth Animations** - Cards fade in smoothly when added, scale during drag operations
- **Hover Effects** - Cards lift slightly on hover with enhanced shadows
- **Modal Transitions** - Modals slide and fade in for a polished feel
- **Responsive Layout** - Adapts perfectly from mobile (280px columns) to desktop (350px columns)
- **Empty States** - Delightful empty column messages with sparkle emoji
- **Task Counters** - Visual task count badges on each column

## 📱 Responsive Breakpoints

- **Mobile**: 280px column width, optimized touch interactions
- **Tablet**: 320px column width, adjusted spacing
- **Desktop**: 350px column width, full feature set

## ⌨️ Keyboard Support

- **Tab** - Navigate through UI elements
- **Enter** - Submit forms, trigger actions
- **Escape** - Close modals
- **Drag Support** - Full keyboard drag-and-drop support via @dnd-kit

## 🐛 Known Limitations

- One browser/device per board (local storage is device-specific)
- No real-time collaboration
- No dark mode (yet)

## 🔮 Future Enhancements

Consider adding:
- Dark mode support
- Export board as JSON/CSV
- Import from JSON files
- Due dates and priority levels
- Labels/tags for tasks
- Search and filter functionality
- Multiple boards
- Cloud sync (Firebase, Supabase, etc.)
- Team collaboration features

## 📄 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── kanban/           # Kanban-specific components
│   │   ├── Board.tsx     # Main board container
│   │   ├── Column.tsx    # Column component
│   │   ├── TaskCard.tsx  # Task card component
│   │   ├── AddTaskModal.tsx
│   │   └── AddColumnModal.tsx
│   └── ui/               # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       └── Modal.tsx
├── stores/
│   └── kanbanStore.ts    # Zustand state management
├── types/
│   └── kanban.ts         # TypeScript interfaces
└── lib/
    └── utils.ts          # Utility functions
```

## 🧪 Testing

The application includes comprehensive Playwright tests. To run tests:

```bash
npx playwright test
```

Tests cover:
- Drag and drop functionality
- Task CRUD operations
- Column management
- UI interactions
- State persistence

## 🚀 Production Build

```bash
npm run build
npm start
```

The production build is optimized and ready for deployment.

## 📝 License

This project is open source and available for personal and commercial use.

---

**Made with ❤️ for beautiful, vibe-coding experiences**

Enjoy your Kanban board! 🎉
