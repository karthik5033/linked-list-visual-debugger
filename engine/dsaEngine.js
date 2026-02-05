/**
 * DSA Engine
 * Core logic for executing linked list operations step-by-step
 * Mirrors C++ algorithms and emits steps for visualization
 */

import { MemoryModel } from './memoryModel.js';
import { StepEmitter } from './stepEmitter.js';

export class DSAEngine {
  constructor() {
    this.memory = new MemoryModel();
    this.stepEmitter = new StepEmitter();
  }

  // Execute an operation and generate steps
  executeOperation(listType, operation, params) {
    this.stepEmitter.clear();

    switch (listType) {
      case 'singly':
        return this.executeSinglyOperation(operation, params);
      case 'doubly':
        return this.executeDoublyOperation(operation, params);
      case 'circular-singly':
        return this.executeCircularSinglyOperation(operation, params);
      case 'circular-doubly':
        return this.executeCircularDoublyOperation(operation, params);
      default:
        throw new Error(`Unknown list type: ${listType}`);
    }
  }

  // Singly Linked List Operations
  executeSinglyOperation(operation, params) {
    switch (operation) {
      case 'insertHead':
        return this.singlyInsertHead(params.value);
      case 'insertTail':
        return this.singlyInsertTail(params.value);
      case 'deleteValue':
        return this.singlyDeleteValue(params.value);
      case 'search':
        return this.singlySearch(params.value);
      case 'deleteHead':
        return this.singlyDeleteHead();
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  // Singly Linked List: Insert at Head
  singlyInsertHead(value) {
    const variables = { value, newNode: null, head: this.memory.head };

    // Step 0: Check constraints (optional, good for visuals)
    this.stepEmitter.addStep(
      null,
      { ...variables },
      this.memory.getState(),
      `// Preparing to insert ${value} at head`
    );

    // Step 1: Create new node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(
      1,
      { ...variables },
      this.memory.getState(),
      `Node* newNode = new Node(${value});`
    );

    // Step 2: newNode->next = head
    this.memory.setNext(newNodeId, this.memory.head);

    this.stepEmitter.addStep(
      2,
      { ...variables },
      this.memory.getState(),
      `newNode->next = head;`
    );

    // Step 3: head = newNode
    this.memory.setHead(newNodeId);
    variables.head = newNodeId;

    // Maintain tail if list was empty
    if (!this.memory.tail) {
      this.memory.setTail(newNodeId);
    }

    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `head = newNode; // Head now points to the new node`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Insert at Tail
  singlyInsertTail(value) {
    const variables = { value, newNode: null, tail: this.memory.tail };

    // Step 1: Create new node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(
      1,
      { ...variables },
      { ...this.memory.getState(), highlights: [newNodeId] },
      `Node* newNode = new Node(${value});`
    );

    // Case 1: List is empty
    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);

      this.stepEmitter.addStep(
        2,
        { ...variables, head: newNodeId },
        { ...this.memory.getState(), highlights: [newNodeId] },
        `if (head == nullptr) { head = tail = newNode; }`
      );
    } else {
      // Case 2: List is not empty
      const oldTail = this.memory.tail;

      this.memory.setNext(oldTail, newNodeId);

      this.stepEmitter.addStep(
        5,
        { ...variables },
        { ...this.memory.getState(), highlights: [oldTail, newNodeId] },
        `tail->next = newNode; // Link old tail to new node`
      );

      this.memory.setTail(newNodeId);

      this.stepEmitter.addStep(
        6,
        { ...variables, tail: newNodeId },
        { ...this.memory.getState(), highlights: [newNodeId] },
        `tail = newNode; // Update tail pointer`
      );
    }

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Delete Head
  singlyDeleteHead() {
    const variables = { head: this.memory.head, temp: null };

    // Case 0: Empty list
    if (!this.memory.head) {
      this.stepEmitter.addStep(
        1,
        { ...variables },
        this.memory.getState(),
        `if (head == nullptr) return; // List is empty`
      );
      return this.stepEmitter.getSteps();
    }

    // Step 1: Store head to delete
    const nodeToDelete = this.memory.head;
    variables.temp = nodeToDelete;

    this.stepEmitter.addStep(
      2,
      { ...variables },
      { ...this.memory.getState(), highlights: [nodeToDelete] },
      `Node* playedSong = head;`
    );

    // Step 2: Move head
    const nextNode = this.memory.getNode(nodeToDelete).next;
    this.memory.setHead(nextNode);
    variables.head = nextNode;

    // If list becomes empty, update tail
    if (!nextNode) {
      this.memory.setTail(null);
    }

    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `head = head->next;`
    );

    // Step 3: Delete old head
    this.memory.deleteNode(nodeToDelete);

    this.stepEmitter.addStep(
      4,
      { ...variables },
      this.memory.getState(),
      `delete playedSong;`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Delete Value
  singlyDeleteValue(value) {
    const variables = { value, current: this.memory.head, prev: null };

    // Case 0: Empty list
    if (!this.memory.head) {
      this.stepEmitter.addStep(
        1,
        { ...variables },
        this.memory.getState(),
        `if (head == nullptr) return; // List is empty`
      );
      return this.stepEmitter.getSteps();
    }

    let current = this.memory.head;
    let prev = null;
    let stepCount = 1;

    // Special Case: Head holds the value
    if (this.memory.getNode(current).value == value) {
      this.stepEmitter.addStep(
        2,
        { ...variables },
        { ...this.memory.getState(), highlights: [current] },
        `if (head->data == ${value}) { ... } // Value found at head`
      );

      const nextNode = this.memory.getNode(current).next;
      this.memory.setHead(nextNode);

      // If list becomes empty, update tail
      if (!nextNode) {
        this.memory.setTail(null);
      }

      this.memory.deleteNode(current); // Actually delete from memory

      this.stepEmitter.addStep(
        3,
        { ...variables, head: nextNode },
        this.memory.getState(),
        `Node* temp = head; head = head->next; delete temp;`
      );
      return this.stepEmitter.getSteps();
    }

    // Traversal
    while (current && this.memory.getNode(current).value != value) {
      variables.current = current;
      variables.prev = prev;

      this.stepEmitter.addStep(
        7,
        { ...variables },
        { ...this.memory.getState(), highlights: [current] },
        `while (current != nullptr && current->data != ${value}) { prev = current; current = current->next; }`
      );

      prev = current;
      current = this.memory.getNode(current).next;
    }

    // Found or End of List
    if (!current) {
      this.stepEmitter.addStep(
        stepCount++,
        { ...variables },
        this.memory.getState(),
        `// Value ${value} not found in the list`
      );
      return this.stepEmitter.getSteps();
    }

    // Delete node
    const nodeToDelete = current;
    const nextNode = this.memory.getNode(nodeToDelete).next;

    variables.current = nodeToDelete;
    variables.prev = prev;

    // Unlink
    this.memory.setNext(prev, nextNode);

    // Update tail if deleting last node
    if (!nextNode) {
      this.memory.setTail(prev);
    }

    this.stepEmitter.addStep(
      11,
      { ...variables },
      { ...this.memory.getState(), highlights: [prev, nodeToDelete] },
      `prev->next = current->next; delete current;`
    );

    this.memory.deleteNode(nodeToDelete);

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Search
  singlySearch(value) {
    const variables = { value, current: this.memory.head, index: 0 };
    let current = this.memory.head;
    let stepCount = 1;
    let index = 0;

    this.stepEmitter.addStep(
      0,
      { ...variables },
      this.memory.getState(),
      `Node* current = head; int index = 0;`
    );

    while (current) {
      variables.current = current;
      variables.index = index;

      const isMatch = this.memory.getNode(current).value == value;

      this.stepEmitter.addStep(
        stepCount++,
        { ...variables },
        { ...this.memory.getState(), highlights: [current] },
        `if (current->data == ${value}) ${isMatch ? 'return index;' : '// No match'}`
      );

      if (isMatch) {
        return this.stepEmitter.getSteps();
      }

      current = this.memory.getNode(current).next;
      index++;

      this.stepEmitter.addStep(
        stepCount++,
        { ...variables },
        { ...this.memory.getState(), highlights: [current] }, // Highlight next node in preparation
        `current = current->next; index++;`
      );
    }

    this.stepEmitter.addStep(
      8,
      { ...variables, current: null },
      this.memory.getState(),
      `return -1; // Not found`
    );

    return this.stepEmitter.getSteps();
  }

  // Doubly Linked List Operations
  executeDoublyOperation(operation, params) {
    switch (operation) {
      case 'insertAfterCurrent':
        return this.doublyInsertAfterCurrent(params.value);
      case 'deleteForwardHistory':
        return this.doublyDeleteForwardHistory();
      case 'moveToPrev':
        return this.doublyMoveToPrev();
      case 'moveToNext':
        return this.doublyMoveToNext();
      case 'visitPage':
        return this.doublyVisitPage(params.value);
      default:
        throw new Error(`Unknown doubly operation: ${operation}`);
    }
  }

  // Doubly LL: Visit New Page (Browser History)
  doublyVisitPage(url) {
    const variables = { url, newNode: null, curr: this.memory.curr };

    // Step 1: Create new node
    this.stepEmitter.addStep(
      1,
      { ...variables },
      this.memory.getState(),
      `Node* newNode = new Node("${url}");`
    );

    const newNodeId = this.memory.createNode(url);
    variables.newNode = newNodeId;

    // If list is empty
    if (!this.memory.head) {
      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `if (head == nullptr) { head = curr = newNode; }`
      );

      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
      this.memory.setCurr(newNodeId);

      this.stepEmitter.addStep(
        3,
        { head: newNodeId, curr: newNodeId },
        this.memory.getState(),
        `Visit complete - first page loaded`
      );

      return this.stepEmitter.getSteps();
    }

    // Step 2: Check if forward history exists
    const currNode = this.memory.getNode(this.memory.curr);
    const hasForwardHistory = currNode.next !== null;

    this.stepEmitter.addStep(
      2,
      { ...variables, hasForwardHistory },
      this.memory.getState(),
      `if (curr->next != nullptr) { // Check forward history }`
    );

    // Step 3: Delete forward history if exists
    if (hasForwardHistory) {
      this.stepEmitter.addStep(
        3,
        { ...variables },
        this.memory.getState(),
        `deleteForwardHistory(curr->next); // Clear forward pages`
      );

      // Delete all nodes after current
      let nodeToDelete = currNode.next;
      while (nodeToDelete) {
        const nextToDelete = this.memory.getNode(nodeToDelete).next;
        this.memory.deleteNode(nodeToDelete);
        nodeToDelete = nextToDelete;
      }
    }

    // Step 4: newNode->prev = curr
    this.stepEmitter.addStep(
      4,
      { ...variables },
      this.memory.getState(),
      `newNode->prev = curr;`
    );

    this.memory.setPrev(newNodeId, this.memory.curr);

    // Step 5: newNode->next = nullptr
    this.stepEmitter.addStep(
      5,
      { ...variables },
      this.memory.getState(),
      `newNode->next = nullptr;`
    );

    // Step 6: curr->next = newNode
    this.stepEmitter.addStep(
      6,
      { ...variables },
      this.memory.getState(),
      `curr->next = newNode;`
    );

    this.memory.setNext(this.memory.curr, newNodeId);

    // Step 7: curr = newNode
    this.stepEmitter.addStep(
      7,
      { ...variables },
      this.memory.getState(),
      `curr = newNode; // Navigate to new page`
    );

    this.memory.setCurr(newNodeId);
    this.memory.setTail(newNodeId);

    // Final step
    this.stepEmitter.addStep(
      8,
      { curr: newNodeId },
      this.memory.getState(),
      `Page loaded: ${url}`
    );

    return this.stepEmitter.getSteps();
  }

  // Doubly LL: Move to Previous (Back Button)
  doublyMoveToPrev() {
    const variables = { curr: this.memory.curr };

    if (!this.memory.curr) {
      this.stepEmitter.addStep(
        1,
        { ...variables },
        this.memory.getState(),
        `No current page`
      );
      return this.stepEmitter.getSteps();
    }

    const currNode = this.memory.getNode(this.memory.curr);

    // Step 1: Check if prev exists
    this.stepEmitter.addStep(
      1,
      { ...variables, prev: currNode.prev },
      this.memory.getState(),
      `if (curr->prev != nullptr) {`
    );

    if (!currNode.prev) {
      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `Already at first page - Back disabled`
      );
      return this.stepEmitter.getSteps();
    }

    // Step 2: curr = curr->prev
    this.stepEmitter.addStep(
      2,
      { ...variables, newCurr: currNode.prev },
      this.memory.getState(),
      `curr = curr->prev; // Go back`
    );

    this.memory.setCurr(currNode.prev);

    // Final step
    const prevPage = this.memory.getNode(currNode.prev).value;
    this.stepEmitter.addStep(
      3,
      { curr: currNode.prev },
      this.memory.getState(),
      `Navigated back to: ${prevPage}`
    );

    return this.stepEmitter.getSteps();
  }

  // Doubly LL: Move to Next (Forward Button)
  doublyMoveToNext() {
    const variables = { curr: this.memory.curr };

    if (!this.memory.curr) {
      this.stepEmitter.addStep(
        1,
        { ...variables },
        this.memory.getState(),
        `No current page`
      );
      return this.stepEmitter.getSteps();
    }

    const currNode = this.memory.getNode(this.memory.curr);

    // Step 1: Check if next exists
    this.stepEmitter.addStep(
      1,
      { ...variables, next: currNode.next },
      this.memory.getState(),
      `if (curr->next != nullptr) {`
    );

    if (!currNode.next) {
      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `Already at last page - Forward disabled`
      );
      return this.stepEmitter.getSteps();
    }

    // Step 2: curr = curr->next
    this.stepEmitter.addStep(
      2,
      { ...variables, newCurr: currNode.next },
      this.memory.getState(),
      `curr = curr->next; // Go forward`
    );

    this.memory.setCurr(currNode.next);

    // Final step
    const nextPage = this.memory.getNode(currNode.next).value;
    this.stepEmitter.addStep(
      3,
      { curr: currNode.next },
      this.memory.getState(),
      `Navigated forward to: ${nextPage}`
    );

    return this.stepEmitter.getSteps();
  }

  // Placeholder methods for other list types
  // Circular Singly LL: Round Robin Scheduling + Generic
  executeCircularSinglyOperation(operation, params) {
    switch (operation) {
      // Application Specific
      case 'addProcess':
        return this.circularSinglyAddProcess(params.value, params.burstTime);
      case 'runTimeSlice':
        return this.circularSinglyRunTimeSlice();

      // Generic Operations
      case 'insertHead':
        return this.circularSinglyInsertHead(params.value);
      case 'insertTail':
        return this.circularSinglyInsertTail(params.value);
      case 'deleteValue':
        return this.circularSinglyDeleteValue(params.value);

      default:
        throw new Error(`Unknown circular singly operation: ${operation}`);
    }
  }

  // Generic Circular Singly Implementations
  circularSinglyInsertHead(value) {
    const variables = { value, newNode: null };
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* newNode = new Node(${value});`);

    if (!this.memory.head) {
      // Empty list: point to self
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
      this.memory.setNext(newNodeId, newNodeId);
      this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `head = tail = newNode; tail->next = head;`);
    } else {
      // Insert at head: New node points to head, Tail points to new node, Head becomes new node
      const head = this.memory.head;
      const tail = this.memory.tail;

      // newNode->next = head
      this.memory.setNext(newNodeId, head);
      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `newNode->next = head;`);

      // tail->next = newNode
      this.memory.setNext(tail, newNodeId);
      this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `tail->next = newNode;`);

      // head = newNode
      this.memory.setHead(newNodeId);
      this.stepEmitter.addStep(5, { ...variables }, this.memory.getState(), `head = newNode;`);
    }
    return this.stepEmitter.getSteps();
  }

  circularSinglyInsertTail(value) {
    const variables = { value, newNode: null };
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* newNode = new Node(${value});`);

    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
      this.memory.setNext(newNodeId, newNodeId);
      this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `head = tail = newNode; tail->next = head;`);
    } else {
      const head = this.memory.head;
      const tail = this.memory.tail;

      // tail->next = newNode
      this.memory.setNext(tail, newNodeId);
      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `tail->next = newNode;`);

      // newNode->next = head
      this.memory.setNext(newNodeId, head);
      this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `newNode->next = head;`);

      // tail = newNode
      this.memory.setTail(newNodeId);
      this.stepEmitter.addStep(5, { ...variables }, this.memory.getState(), `tail = newNode;`);
    }
    return this.stepEmitter.getSteps();
  }

  circularSinglyDeleteValue(value) {
    // Simplified: Find value and delete
    if (!this.memory.head) return [];

    // Case 1: Head has value
    // Since it's generic, we might delete head. If so, we need to update tail->next.
    // Optimization: For this visualizer, let's reuse standard logic but assume we always track tail.

    // Simplest approach: Delegate to memory model manipulations and generate steps
    // TODO: Full implementation requires traversal. For now, doing simple visual steps.

    return []; // Placeholder for complex generic delete in circular
  }

  circularSinglyAddProcess(name, burstTime) {
    const value = `${name} (${burstTime})`;
    const variables = { name, burstTime, newNode: null };

    // Step 1: Create Node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(
      1,
      { ...variables },
      this.memory.getState(),
      `Node* newProcess = new Node("${name}", ${burstTime});`
    );

    // Case 1: Empty List
    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
      this.memory.setNext(newNodeId, newNodeId); // Point to self

      this.stepEmitter.addStep(
        2,
        { ...variables, head: newNodeId, tail: newNodeId },
        this.memory.getState(),
        `if (head == nullptr) { head = tail = newProcess; tail->next = head; }`
      );
    } else {
      // Case 2: Append to list
      const oldTail = this.memory.tail;
      const head = this.memory.head;

      // tail->next = newProcess
      this.memory.setNext(oldTail, newNodeId);

      this.stepEmitter.addStep(
        3,
        { ...variables },
        this.memory.getState(),
        `tail->next = newProcess;`
      );

      // newProcess->next = head
      this.memory.setNext(newNodeId, head);

      this.stepEmitter.addStep(
        4,
        { ...variables },
        this.memory.getState(),
        `newProcess->next = head;`
      );

      // tail = newProcess
      this.memory.setTail(newNodeId);

      this.stepEmitter.addStep(
        5,
        { ...variables },
        this.memory.getState(),
        `tail = newProcess;`
      );
    }

    // Set current if not set
    if (!this.memory.curr) {
      this.memory.setCurr(this.memory.head);
    }

    return this.stepEmitter.getSteps();
  }

  circularSinglyRunTimeSlice() {
    if (!this.memory.curr) return [];

    const currentId = this.memory.curr;
    const currentNode = this.memory.getNode(currentId);

    // Parse burst time from value "Name (Time)"
    const match = currentNode.value.match(/(.+) \((\d+)\)/);
    if (!match) return [];

    const name = match[1];
    let time = parseInt(match[2]);
    const variables = { process: name, timeRemaining: time };

    this.stepEmitter.addStep(
      1,
      { ...variables },
      { ...this.memory.getState(), highlights: [currentId] },
      `// Running process ${name}...`
    );

    time--;
    variables.timeRemaining = time;

    if (time > 0) {
      // Update value
      const newValue = `${name} (${time})`;
      this.memory.updateValue(currentId, newValue); // Assuming memory model supports this, if not we need to add it or hack it

      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `process.time--; // Remaining: ${time}`
      );

      // Rotate
      const nextId = currentNode.next;
      this.memory.setCurr(nextId);

      this.stepEmitter.addStep(
        3,
        { ...variables, nextProcess: nextId },
        this.memory.getState(),
        `current = current->next; // Move to next process`
      );
    } else {
      // Process finished, delete it
      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `process.time == 0; // Process Completed`
      );

      // Delete Logic
      // 1. Find Prev (since it's singly, we need to traverse if we don't have prev pointer, but for RR visualization we can cheat or traverse)
      // Since it's circular singly, finding prev is O(N).

      let prev = this.memory.head;
      while (this.memory.getNode(prev).next !== currentId && prev !== currentId) {
        prev = this.memory.getNode(prev).next; // Risk of infinite loop if broken
        // Safety break?
        if (!prev) break;
      }

      // Special case: Single Node
      if (prev === currentId) {
        this.memory.reset(); // Clear all
        this.stepEmitter.addStep(
          3,
          { ...variables },
          this.memory.getState(),
          `delete current; head = nullptr; // List empty`
        );
        return this.stepEmitter.getSteps();
      }

      const nextId = currentNode.next;

      // Update links
      this.memory.setNext(prev, nextId);

      // Update Head/Tail if needed
      if (this.memory.head === currentId) this.memory.setHead(nextId);
      if (this.memory.tail === currentId) this.memory.setTail(prev);

      this.memory.deleteNode(currentId);
      this.memory.setCurr(nextId);

      this.stepEmitter.addStep(
        4,
        { ...variables },
        this.memory.getState(),
        `prev->next = current->next; delete current;`
      );
    }

    return this.stepEmitter.getSteps();
  }

  // Circular Doubly LL: Fibonacci Heap Root List + Generic
  executeCircularDoublyOperation(operation, params) {
    switch (operation) {
      // Application Specific
      case 'insertRoot':
        return this.circularDoublyInsertRoot(params.value);
      case 'removeMin':
        return this.circularDoublyRemoveMin();

      // Generic Operations
      case 'insertHead':
        return this.circularDoublyInsertHead(params.value);
      case 'insertTail':
        return this.circularDoublyInsertTail(params.value);

      default:
        throw new Error(`Unknown circular doubly operation: ${operation}`);
    }
  }

  circularDoublyInsertHead(value) {
    return this.circularDoublyGenericInsert(value, true);
  }

  circularDoublyInsertTail(value) {
    return this.circularDoublyGenericInsert(value, false);
  }

  circularDoublyGenericInsert(value, atHead) {
    const variables = { value, newNode: null };
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* newNode = new Node(${value});`);

    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
      this.memory.setNext(newNodeId, newNodeId);
      this.memory.setPrev(newNodeId, newNodeId);
      this.memory.setCurr(newNodeId);
      this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `head = tail = newNode; head->next = head; head->prev = head;`);
    } else {
      const head = this.memory.head;
      const tail = this.memory.tail;

      // 1. Connect new node to head and tail
      this.memory.setNext(newNodeId, head);
      this.memory.setPrev(newNodeId, tail);

      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `newNode->next = head; newNode->prev = tail;`);

      // 2. Connect tail to new node
      this.memory.setNext(tail, newNodeId);
      this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `tail->next = newNode;`);

      // 3. Connect head to new node
      this.memory.setPrev(head, newNodeId);
      this.stepEmitter.addStep(5, { ...variables }, this.memory.getState(), `head->prev = newNode;`);

      // 4. Update pointer
      if (atHead) {
        this.memory.setHead(newNodeId);
        this.stepEmitter.addStep(6, { ...variables }, this.memory.getState(), `head = newNode;`);
      } else {
        this.memory.setTail(newNodeId);
        this.stepEmitter.addStep(6, { ...variables }, this.memory.getState(), `tail = newNode;`);
      }
    }
    return this.stepEmitter.getSteps();
  }

  circularDoublyInsertRoot(value) {
    const variables = { value, newNode: null };
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* tree = new Node(${value});`);

    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
      this.memory.setNext(newNodeId, newNodeId);
      this.memory.setPrev(newNodeId, newNodeId);
      this.memory.setCurr(newNodeId); // Focus on single tree

      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `head = tree; tree->next = tree; tree->prev = tree;`
      );
    } else {
      // Insert left of head (effectively append to tail, but Fib Heaps usually insert near min or head)
      // Let's insert 'At Head' (between Tail and Head)
      const head = this.memory.head;
      const tail = this.memory.tail; // In circular, tail is head->prev. We track explicit tail for visualization convenience.

      // 1. tree->next = head
      this.memory.setNext(newNodeId, head);

      // 2. tree->prev = tail
      this.memory.setPrev(newNodeId, tail);

      // 3. tail->next = tree
      this.memory.setNext(tail, newNodeId);

      // 4. head->prev = tree
      this.memory.setPrev(head, newNodeId);

      // Usually Fib Heap updates min pointer. Here we just update head/tail conceptually.
      // Let's update Head to new node (arbitrary, but standard implementation often merges into root list)
      this.memory.setHead(newNodeId);
      // Previous head is now just a node. New node is head.
      // The old 'tail' remains the 'last' node conceptually before the wrap.

      this.stepEmitter.addStep(
        3,
        { ...variables },
        this.memory.getState(),
        `tree->next = head; tree->prev = head->prev; head->prev->next = tree; head->prev = tree; head = tree;`
      );
    }
    return this.stepEmitter.getSteps();
  }

  circularDoublyRemoveMin() {
    // Simplified: Remove HEAD (assuming it's min or focus)
    if (!this.memory.head) return [];

    const z = this.memory.head;
    const variables = { z };

    this.stepEmitter.addStep(1, { ...variables }, { ...this.memory.getState(), highlights: [z] }, `// Removing minimum node (head)`);

    // Case: Single Node
    if (this.memory.getNext(z) === z) {
      this.memory.reset();
      this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `head = nullptr; // Heap empty`);
      return this.stepEmitter.getSteps();
    }

    const prev = this.memory.getPrev(z);
    const next = this.memory.getNext(z);

    // prev->next = next
    this.memory.setNext(prev, next);

    // next->prev = prev
    this.memory.setPrev(next, prev);

    // head = next
    this.memory.setHead(next);
    // Logic for 'tail' update if we track it explicitly:
    if (this.memory.tail === z) this.memory.setTail(prev);
    if (this.memory.curr === z) this.memory.setCurr(next);

    this.memory.deleteNode(z);

    this.stepEmitter.addStep(
      3,
      { ...variables, head: next },
      this.memory.getState(),
      `z->prev->next = z->next; z->next->prev = z->prev; head = z->next; delete z;`
    );

    return this.stepEmitter.getSteps();
  }

  // Reset the engine
  reset() {
    this.memory.reset();
    this.stepEmitter.clear();
  }

  // Get current memory state
  getMemoryState() {
    return this.memory.getState();
  }
}
