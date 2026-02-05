# Linked List Visual Debugger

A visual debugger for the entire family of linked lists, powered by real C++ algorithms and step-by-step execution.

## 🎯 Project Vision

This is **NOT** an animation tool. This is a **Visual Debugger for Linked Lists** that allows students to:

- Execute real C++ linked list algorithms
- Observe how memory, pointers, and variables change
- Watch step-by-step execution like a debugger

## 📚 Linked List Types Covered

1. **Singly Linked List** ✅ (Implemented)
2. **Doubly Linked List** 🚧 (Coming Soon)
3. **Circular Singly Linked List** 🚧 (Coming Soon)
4. **Circular Doubly Linked List** 🚧 (Coming Soon)

## 🛠️ Tech Stack

- **UI**: Next.js (App Router) + React + Tailwind CSS
- **Visualization**: HTML/CSS/SVG
- **Logic**: JavaScript implementations mirroring C++ algorithms
- **Fully Client-Side**: Yes

## 🏗️ Architecture

```
User Action
   ↓
C++ Code Map (lines)
   ↓
JS DSA Step Engine (mirrors C++)
   ↓
Memory Model
   ↓
Step Emitter
   ↓
UI Panels Update
```

## 📁 Project Structure

```
├── app/
│   ├── layout.jsx
│   ├── page.jsx (Landing page)
│   └── linked-list/
│       ├── singly/page.jsx
│       ├── doubly/page.jsx
│       ├── circular-singly/page.jsx
│       └── circular-doubly/page.jsx
├── components/
│   ├── ControlPanel.jsx
│   ├── MemoryBoard.jsx
│   ├── CodePanel.jsx
│   ├── VariableWatch.jsx
│   ├── Node.jsx
│   └── Arrow.jsx
├── engine/
│   ├── dsaEngine.js (Core algorithm execution)
│   ├── memoryModel.js (Memory state management)
│   └── stepEmitter.js (Step-by-step control)
├── codeMap/
│   ├── singlyLL.cpp.js (Real C++ code)
│   ├── doublyLL.cpp.js
│   ├── circularSinglyLL.cpp.js
│   └── circularDoublyLL.cpp.js
└── hooks/
    └── useStepRunner.js
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 🎮 How to Use

1. **Select a Linked List Type** from the home page
2. **Choose an Operation** (Insert, Delete, Traverse, Reverse, etc.)
3. **Enter Values** if required
4. **Click Execute** to generate steps
5. **Use Next/Previous** buttons to step through the algorithm
6. **Watch** the code highlight, memory update, and variables change

## 🎨 Features

### For Every Step, You See:

- ✅ **Active C++ Line** highlighted in the code panel
- ✅ **Memory State** with visual nodes and arrows
- ✅ **Variables** (head, tail, prev, curr, next) in real-time
- ✅ **Step Description** explaining what's happening

### Singly Linked List Operations (Implemented):

- Insert at Head
- Insert at Tail
- Delete Head
- Delete Tail
- Traverse
- Reverse

## 🎯 What Makes This Different?

| Normal Project | This Project |
|----------------|--------------|
| One linked list | Whole LL family |
| Animation | Debugger style |
| JS logic only | Real C++ code shown |
| No memory view | Memory + variables + code |

## 📖 Learning Outcomes

Students will clearly understand:

- How pointers behave in every type of linked list
- How C++ code manipulates memory
- Why edge cases matter (empty list, single node, etc.)

## 🔮 Future Scope

- Stack/Queue using Linked Lists
- Trees (BST, AVL)
- Custom code input

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ for DSA learners everywhere
