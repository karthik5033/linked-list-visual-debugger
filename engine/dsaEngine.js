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
  executeCircularSinglyOperation(operation, params) {
    // TODO: Implement circular singly linked list operations
    return [];
  }

  executeCircularDoublyOperation(operation, params) {
    // TODO: Implement circular doubly linked list operations
    return [];
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
