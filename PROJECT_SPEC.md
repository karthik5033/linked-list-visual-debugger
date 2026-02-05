Project Title

Visual Debugger for Data Structures with Real-Time Memory Simulation

1. Project Vision

This project is an interactive educational platform that allows users to perform data structure operations and observe how memory, pointers, and variables change step-by-step, exactly like a debugger.

The goal is not animation.
The goal is code-to-memory understanding.

The system behaves like a DSA Debugger.

2. Core Principle (MOST IMPORTANT)

At any time during execution, the system must show:

Current code line being executed

Current state of data structure in memory

Current values of important variables (head, temp, prev, etc.)

Step-by-step execution (not instant animation)

Everything in the UI revolves around this principle.

3. Data Structures Supported (Phase 1)

Array

Singly Linked List

Stack

Queue

System must be designed so more DS can be added later.

4. System Architecture

The project is divided into 6 logical layers:

4.1 UI Layer

Contains controls, panels, and layout.

4.2 DSA Engine (Core Logic)

Pure JavaScript implementations of all DS operations.

This layer:

Performs operations step-by-step

Emits state updates after each step

4.3 Memory Engine

Maintains a memory model representing nodes, pointers, array cells, stack frames.

This is NOT UI. This is data.

4.4 Visualization Layer

Reads Memory Engine and renders nodes, arrows, boxes.

4.5 Code Sync Engine

Maps each step of algorithm to a code line highlight.

4.6 Variable Watcher

Displays live values of important variables.

5. Folder Structure (strict)
src/
 ├─ components/
 │   ├─ ControlPanel.jsx
 │   ├─ MemoryBoard.jsx
 │   ├─ CodePanel.jsx
 │   ├─ VariableWatch.jsx
 │
 ├─ engine/
 │   ├─ dsaEngine.js
 │   ├─ memoryModel.js
 │   ├─ stepEmitter.js
 │
 ├─ visualizer/
 │   ├─ linkedListVisualizer.js
 │   ├─ arrayVisualizer.js
 │   ├─ stackVisualizer.js
 │   ├─ queueVisualizer.js
 │
 ├─ codeMap/
 │   ├─ linkedListCode.js
 │   ├─ stackCode.js
 │   ├─ queueCode.js
 │
 ├─ pages/
 │   ├─ LinkedListPage.jsx
 │   ├─ ArrayPage.jsx
 │   ├─ StackPage.jsx
 │   ├─ QueuePage.jsx

6. Execution Model (CRITICAL)

Every operation is executed like this:

User clicks operation
→ dsaEngine starts algorithm
→ after each logical step:
      stepEmitter emits:
         {
           memoryState,
           activeLine,
           variables
         }
→ UI updates
→ waits for Next Step click


No auto animation. Only step execution.

7. Memory Model Format

Memory is stored as objects.

Example for Linked List:

nodes = {
  id1: { value: 10, next: id2 },
  id2: { value: 20, next: null }
}

head = id1


This memory object is what visualizer uses.

8. What Each Panel Does
ControlPanel

Choose DS

Choose operation

Input value

Next Step button

Reset

MemoryBoard

Draws nodes/boxes/arrows based on memory model

CodePanel

Shows code

Highlights activeLine

VariableWatch

Shows current variable values

9. Linked List Operations to Implement

Insert at head

Insert at tail

Delete value

Reverse

Traverse

Each must be broken into atomic steps.

10. Step Example (Insert at Head)

Steps must be:

Create new node

newNode.next = head

head = newNode

Each step triggers UI update.

11. Code Mapping

Each step must map to a code line number.

Example:

1: Node* newNode = new Node(val);
2: newNode->next = head;
3: head = newNode;


When step 2 runs → line 2 highlighted.

12. Visual Theme

White background

Clean grid layout

Tailark components for panels

Minimal colors

Nodes: soft borders, subtle shadow

Pointers: SVG arrows

13. Edge Cases to Handle

Insert in empty

Delete head

Delete non-existent

Reverse empty

Stack underflow

Queue overflow

14. Non-Functional Requirements

Fully client-side

Modular code

Easy to extend for new DS

Smooth rendering

No page reloads

15. What This Project Is

This is NOT:

an animation tool

a visualizer

This is:

A Visual Debugger for Data Structures

16. Expected User Experience

User should feel:

“I can finally SEE what pointers and memory are doing.”

17. Future Scope

Doubly LL

BST

Graph

User can paste custom code