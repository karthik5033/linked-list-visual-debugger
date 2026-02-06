/**
 * DSA Engine
 * Core logic for executing linked list operations step-by-step
 * Mirrors C++ algorithms and emits steps for visualization
 * Updated: Force Refresh
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
      case 'deleteTail':
        return this.singlyDeleteTail();
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  // Singly Linked List: Insert at Head
  singlyInsertHead(value) {
    const variables = { value, newNode: null, head: this.memory.head };

    // Action 1: Create new node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    // Step 1: Record state AFTER creating node
    this.stepEmitter.addStep(
      1,
      { ...variables },
      this.memory.getState(),
      `Node* newNode = new Node(${value});`
    );

    // Action 2: newNode->next = head
    this.memory.setNext(newNodeId, this.memory.head);

    // Step 2: Record state AFTER linking
    this.stepEmitter.addStep(
      2,
      { ...variables },
      this.memory.getState(),
      `newNode->next = head;`
    );

    // Action 3: head = newNode
    this.memory.setHead(newNodeId);
    variables.head = newNodeId;

    // Maintain tail if list was empty
    if (!this.memory.tail) {
      this.memory.setTail(newNodeId);
    }

    // Step 3: Record final state
    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `head = newNode;`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Insert at Tail
  singlyInsertTail(value) {
    const variables = { value, newNode: null, tail: this.memory.tail };

    // Action 1: Create new node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    this.stepEmitter.addStep(
      1,
      { ...variables },
      { ...this.memory.getState(), highlights: [newNodeId] },
      `Node* newNode = new Node(${value});`
    );

    // If list is empty
    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);

      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `if (head == nullptr) { head = tail = newNode; }`
      );
    } else {
      // Action 2: tail->next = newNode
      this.memory.setNext(this.memory.tail, newNodeId);

      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `tail->next = newNode;`
      );

      // Action 3: tail = newNode
      this.memory.setTail(newNodeId);
      variables.tail = newNodeId;

      this.stepEmitter.addStep(
        3,
        { ...variables, tail: newNodeId },
        { ...this.memory.getState(), highlights: [newNodeId] },
        `tail = newNode;`
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

    // Action 1: temp = head
    variables.temp = this.memory.head;
    this.stepEmitter.addStep(
      2,
      { ...variables },
      { ...this.memory.getState(), highlights: [this.memory.head] },
      `Node* temp = head;`
    );

    // Action 2: head = head->next
    const nextNode = this.memory.getNode(this.memory.head).next;
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

    // Action 3: delete temp
    this.memory.deleteNode(variables.temp);

    this.stepEmitter.addStep(
      4,
      { ...variables },
      this.memory.getState(),
      `delete temp;`
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

    // Step 10: Unlink (Node still visible but disconnected)
    this.stepEmitter.addStep(
      10,
      { ...variables },
      { ...this.memory.getState(), highlights: [prev, nodeToDelete] },
      `curr->next = temp->next;`
    );

    // Actual Deletion
    this.memory.deleteNode(nodeToDelete);

    // Step 11: Final State (Node gone)
    this.stepEmitter.addStep(
      11,
      { ...variables },
      this.memory.getState(),
      `delete temp;`
    );

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

  // Singly Linked List: Delete Tail
  singlyDeleteTail() {
    const variables = { tail: this.memory.tail, temp: null, current: this.memory.head };

    // Case 0: Empty list
    if (!this.memory.head) {
      this.stepEmitter.addStep(0, { ...variables }, this.memory.getState(), `if (head == nullptr) return;`);
      return this.stepEmitter.getSteps();
    }

    // Case 1: Single node
    if (this.memory.head === this.memory.tail) {
      this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `if (head == tail) { delete head; head = tail = nullptr; }`);
      this.memory.deleteNode(this.memory.head);
      this.memory.setHead(null);
      this.memory.setTail(null);
      return this.stepEmitter.getSteps();
    }

    // Case 2: Traversing to find second-to-last
    let current = this.memory.head;
    let stepLine = 2;

    this.stepEmitter.addStep(stepLine, { ...variables }, this.memory.getState(), `Node* current = head;`);

    // Ensure we have a next node to check
    while (this.memory.getNode(current).next !== this.memory.tail) {
      current = this.memory.getNode(current).next;
      variables.current = current;
      this.stepEmitter.addStep(stepLine++, { ...variables }, this.memory.getState(), `while(current->next != tail) { current = current->next; }`);
    }

    variables.current = current;

    // Action: Set current->next to null
    this.memory.setNext(current, null);

    this.stepEmitter.addStep(stepLine++, { ...variables }, this.memory.getState(), `current->next = nullptr;`);

    // Delete old tail
    this.memory.deleteNode(this.memory.tail);
    this.stepEmitter.addStep(stepLine++, { ...variables }, this.memory.getState(), `delete tail;`);

    // Update tail pointer
    this.memory.setTail(current);
    variables.tail = current;

    this.stepEmitter.addStep(stepLine, { ...variables }, this.memory.getState(), `tail = current;`);

    return this.stepEmitter.getSteps();
  }

  // Doubly Linked List Operations
  executeDoublyOperation(operation, params) {
    switch (operation) {
      case 'insertHead':
        return this.doublyInsertHead(params.value);
      case 'insertTail':
        return this.doublyInsertTail(params.value);
      case 'deleteHead':
        return this.doublyDeleteHead();
      case 'deleteTail':
        return this.doublyDeleteTail();
      case 'deleteValue':
        return this.doublyDeleteValue(params.value);
      case 'search':
        return this.doublySearch(params.value);
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

  // Doubly: Search
  doublySearch(value) {
    const variables = { val: value, current: this.memory.head, index: 0 };
    let stepCount = 1;

    // Step 1: Init
    this.stepEmitter.addStep(
      stepCount++,
      { ...variables },
      this.memory.getState(),
      `Node* current = head; int index = 0;`
    );

    let current = this.memory.head;

    while (current) {
      const node = this.memory.getNode(current);
      variables.current = current;

      // Check Match
      this.stepEmitter.addStep(
        stepCount,
        { ...variables },
        { ...this.memory.getState(), highlights: [current] },
        `if (current->data == val)`
      );

      if (node.value == value) { // Loose equality for string/number mixing
        this.stepEmitter.addStep(
          stepCount + 1,
          { ...variables },
          { ...this.memory.getState(), highlights: [current], success: true },
          `return index; // Found at ${variables.index}`
        );
        return this.stepEmitter.getSteps();
      }

      stepCount++;

      // Move Next
      current = node.next;
      variables.index++;

      if (current) {
        this.stepEmitter.addStep(
          stepCount++,
          { ...variables },
          { ...this.memory.getState(), highlights: [current] },
          `current = current->next; index++;`
        );
      }
    }

    this.stepEmitter.addStep(
      stepCount,
      { ...variables, current: null },
      this.memory.getState(),
      `return -1; // Not found`
    );

    return this.stepEmitter.getSteps();
  }

  // Doubly: Delete Tail
  doublyDeleteTail() {
    const variables = { tail: this.memory.tail, temp: null };

    if (!this.memory.tail) return this.stepEmitter.getSteps();

    // Step 1: temp = tail
    variables.temp = this.memory.tail;
    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* temp = tail;`);

    // Step 2: tail = tail->prev
    const prevNode = this.memory.getNode(this.memory.tail).prev;
    variables.tail = prevNode;
    this.memory.setTail(prevNode);
    this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `tail = tail->prev;`);

    // Step 3: if tail != null, tail->next = null
    if (prevNode) {
      this.memory.setNext(prevNode, null);
      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `if (tail) tail->next = nullptr;`);
    } else {
      // List empty
      this.memory.setHead(null);
      this.stepEmitter.addStep(3, { ...variables, head: null }, this.memory.getState(), `head = nullptr; // List empty`);
    }

    // Step 4: delete temp
    this.memory.deleteNode(variables.temp);
    this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `delete temp;`);

    return this.stepEmitter.getSteps();
  }

  // Doubly: Delete Value
  doublyDeleteValue(value) {
    const variables = { val: value, curr: this.memory.head };
    let stepCount = 1;

    // Step 1: Start traversal
    this.stepEmitter.addStep(stepCount++, { ...variables }, this.memory.getState(), `Node* curr = head;`);

    let curr = this.memory.head;
    let found = false;

    while (curr) {
      variables.curr = curr;
      const node = this.memory.getNode(curr);

      // Check match
      this.stepEmitter.addStep(
        stepCount++,
        { ...variables },
        { ...this.memory.getState(), highlights: [curr] },
        `while (curr != nullptr && curr->data != val)`
      );

      if (node.value == value) {
        found = true;
        break;
      }

      curr = node.next;
      if (curr) {
        this.stepEmitter.addStep(
          stepCount++,
          { ...variables, curr },
          { ...this.memory.getState(), highlights: [curr] },
          `curr = curr->next;`
        );
      }
    }

    if (!found) { // Not found
      this.stepEmitter.addStep(stepCount, { ...variables }, this.memory.getState(), `if (curr == nullptr) return;`);
      return this.stepEmitter.getSteps();
    }

    // Found node at 'curr'
    const nodeToDelete = curr;
    const prevNode = this.memory.getNode(nodeToDelete).prev;
    const nextNode = this.memory.getNode(nodeToDelete).next;

    // Step: Unlink Prev
    if (prevNode) {
      this.memory.setNext(prevNode, nextNode);
      this.stepEmitter.addStep(
        stepCount++,
        { ...variables },
        { ...this.memory.getState(), highlights: [prevNode, nodeToDelete] },
        `if (curr->prev) curr->prev->next = curr->next;`
      );
    } else {
      this.memory.setHead(nextNode);
      this.stepEmitter.addStep(
        stepCount++,
        { ...variables, head: nextNode },
        this.memory.getState(),
        `else head = curr->next;`
      );
    }

    // Step: Unlink Next
    if (nextNode) {
      this.memory.setPrev(nextNode, prevNode);
      this.stepEmitter.addStep(
        stepCount++,
        { ...variables },
        { ...this.memory.getState(), highlights: [nodeToDelete, nextNode] },
        `if (curr->next) curr->next->prev = curr->prev;`
      );
    } else {
      this.memory.setTail(prevNode);
      this.stepEmitter.addStep(
        stepCount++,
        { ...variables, tail: prevNode },
        this.memory.getState(),
        `else tail = curr->prev;`
      );
    }

    // Step: Delete
    this.memory.deleteNode(nodeToDelete);
    this.stepEmitter.addStep(
      stepCount++,
      { ...variables },
      this.memory.getState(),
      `delete curr;`
    );

    return this.stepEmitter.getSteps();
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
        `Visit complete`
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
        `deleteForwardHistory(curr->next);`
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
      `curr = newNode;`
    );

    this.memory.setCurr(newNodeId);
    this.memory.setTail(newNodeId); // Tail is always current in browser history (if linear)? No, tail is end.

    return this.stepEmitter.getSteps();
  }

  // Doubly LL: Move to Previous (Back Button)
  doublyMoveToPrev() {
    const variables = { curr: this.memory.curr };

    if (!this.memory.curr) {
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
      return this.stepEmitter.getSteps();
    }

    // Step 2: curr = curr->prev
    this.stepEmitter.addStep(
      2,
      { ...variables, newCurr: currNode.prev },
      this.memory.getState(),
      `curr = curr->prev;`
    );

    this.memory.setCurr(currNode.prev);

    return this.stepEmitter.getSteps();
  }

  // Doubly LL: Move to Next (Forward Button)
  doublyMoveToNext() {
    const variables = { curr: this.memory.curr };

    if (!this.memory.curr) {
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
      return this.stepEmitter.getSteps();
    }

    // Step 2: curr = curr->next
    this.stepEmitter.addStep(
      2,
      { ...variables, newCurr: currNode.next },
      this.memory.getState(),
      `curr = curr->next;`
    );

    this.memory.setCurr(currNode.next);

    return this.stepEmitter.getSteps();
  }

  // Doubly: Insert Head
  doublyInsertHead(value) {
    const variables = { value, newNode: null, head: this.memory.head };

    // Action 1: Create Node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;
    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* newNode = new Node(${value});`);

    // Action 2: newNode->next = head
    this.memory.setNext(newNodeId, this.memory.head);
    this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `newNode->next = head;`);

    // Action 3: if head != null, head->prev = newNode
    if (this.memory.head) {
      this.memory.setPrev(this.memory.head, newNodeId);
      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `head->prev = newNode;`);
    }

    // Action 4: head = newNode
    this.memory.setHead(newNodeId);
    variables.head = newNodeId;
    this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `head = newNode;`);

    // Action 5: Handle tail
    if (!this.memory.tail) {
      this.memory.setTail(newNodeId);
      this.stepEmitter.addStep(5, { ...variables }, this.memory.getState(), `tail = newNode; // List was empty`);
    }

    return this.stepEmitter.getSteps();
  }

  // Doubly: Insert Tail
  doublyInsertTail(value) {
    const variables = { value, newNode: null, tail: this.memory.tail };

    // Action 1: Create Node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;
    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* newNode = new Node(${value});`);

    // Action 2: newNode->prev = tail
    this.memory.setPrev(newNodeId, this.memory.tail);
    this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `newNode->prev = tail;`);

    // Action 3: if tail != null, tail->next = newNode
    if (this.memory.tail) {
      this.memory.setNext(this.memory.tail, newNodeId);
      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `tail->next = newNode;`);
    }

    // Action 4: tail = newNode
    this.memory.setTail(newNodeId);
    variables.tail = newNodeId;
    this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `tail = newNode;`);

    // Action 5: Handle head
    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.stepEmitter.addStep(5, { ...variables }, this.memory.getState(), `head = newNode; // List was empty`);
    }

    return this.stepEmitter.getSteps();
  }

  // Doubly: Delete Head
  doublyDeleteHead() {
    const variables = { head: this.memory.head, temp: null };

    if (!this.memory.head) return this.stepEmitter.getSteps();

    // Action 1: temp = head
    variables.temp = this.memory.head;
    this.stepEmitter.addStep(1, { ...variables }, this.memory.getState(), `Node* temp = head;`);

    // Action 2: head = head->next
    const nextNode = this.memory.getNode(this.memory.head).next;
    this.memory.setHead(nextNode);
    variables.head = nextNode;
    this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `head = head->next;`);

    // Action 3: if head != nullptr, head->prev = nullptr
    if (nextNode) {
      this.memory.setPrev(nextNode, null);
      this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `if (head) head->prev = nullptr;`);
    } else {
      this.memory.setTail(null); // List became empty
      this.stepEmitter.addStep(3, { ...variables, head: null }, this.memory.getState(), `tail = nullptr; // List empty`);
    }

    // Action 4: delete temp
    this.memory.deleteNode(variables.temp);
    this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `delete temp;`);

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
      case 'moveToNext':
        return this.circularSinglyMoveToNext();
      case 'moveToPrev':
        return this.circularSinglyMoveToPrev();

      // Generic Operations
      case 'insertHead':
        return this.circularSinglyInsertHead(params.value);
      case 'insertTail':
        return this.circularSinglyInsertTail(params.value);
      case 'deleteValue':
        return this.circularSinglyDeleteValue(params.value);
      case 'deleteHead':
        return this.circularSinglyDeleteHead();
      case 'deleteTail':
        return this.circularSinglyDeleteTail();

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

  circularSinglyDeleteHead() {
    const variables = { head: this.memory.head, tail: this.memory.tail };

    if (!this.memory.head) return this.stepEmitter.getSteps();

    const headId = this.memory.head;

    // Case 1: Single Node
    if (this.memory.getNext(headId) === headId) {
      this.stepEmitter.addStep(1, { ...variables }, { ...this.memory.getState(), highlights: [headId] }, `if (head->next == head) { // Single node`);

      this.memory.setHead(null);
      this.memory.setTail(null);
      this.memory.setCurr(null);
      this.memory.deleteNode(headId);

      this.stepEmitter.addStep(2, { head: null, tail: null }, this.memory.getState(), `head = tail = nullptr; delete head;`);
      return this.stepEmitter.getSteps();
    }

    // Case 2: Multiple Nodes
    const newHead = this.memory.getNode(headId).next;
    const tailIs = this.memory.tail;

    this.stepEmitter.addStep(
      1,
      { ...variables },
      { ...this.memory.getState(), highlights: [headId] },
      `Node* temp = head;`
    );

    // tail->next = newHead
    this.memory.setNext(tailIs, newHead);
    this.stepEmitter.addStep(
      2,
      { ...variables },
      this.memory.getState(),
      `tail->next = head->next;`
    );

    // head = newHead
    this.memory.setHead(newHead);
    this.stepEmitter.addStep(
      3,
      { ...variables, head: newHead },
      this.memory.getState(),
      `head = head->next;`
    );

    // delete old head
    this.memory.deleteNode(headId);
    this.stepEmitter.addStep(
      4,
      { ...variables },
      this.memory.getState(),
      `delete temp;`
    );

    return this.stepEmitter.getSteps();
  }

  circularSinglyDeleteTail() {
    const variables = { head: this.memory.head, tail: this.memory.tail, curr: null };

    if (!this.memory.head) return this.stepEmitter.getSteps();

    const headId = this.memory.head;
    const tailId = this.memory.tail;

    // Case 1: Single Node
    if (headId === tailId) {
      this.stepEmitter.addStep(1, { ...variables }, { ...this.memory.getState(), highlights: [headId] }, `if (head == tail) { // Single node`);

      this.memory.setHead(null);
      this.memory.setTail(null);
      this.memory.setCurr(null);
      this.memory.deleteNode(headId);

      this.stepEmitter.addStep(2, { head: null, tail: null }, this.memory.getState(), `head = tail = nullptr; delete tail;`);
      return this.stepEmitter.getSteps();
    }

    // Case 2: Multiple Nodes (Traverse to find prev to tail)
    let curr = headId;
    this.stepEmitter.addStep(
      1,
      { ...variables, curr },
      { ...this.memory.getState(), highlights: [curr] },
      `Node* curr = head;`
    );

    while (this.memory.getNode(curr).next !== tailId) {
      curr = this.memory.getNode(curr).next;
      this.stepEmitter.addStep(
        2,
        { ...variables, curr },
        { ...this.memory.getState(), highlights: [curr] },
        `while (curr->next != tail) { curr = curr->next; }`
      );
    }

    // Found prev (curr)
    const newTail = curr;
    variables.curr = newTail;

    // curr->next = head
    this.memory.setNext(newTail, headId);
    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `curr->next = head;`
    );

    // tail = curr
    this.memory.setTail(newTail);
    this.stepEmitter.addStep(
      4,
      { ...variables, tail: newTail },
      this.memory.getState(),
      `tail = curr;`
    );

    // delete old tail
    this.memory.deleteNode(tailId);
    this.stepEmitter.addStep(
      5,
      { ...variables },
      this.memory.getState(),
      `delete oldTail;`
    );

    return this.stepEmitter.getSteps();
  }

  circularSinglyDeleteValue(value) {
    const variables = { value, curr: this.memory.head, prev: null };

    if (!this.memory.head) return this.stepEmitter.getSteps();

    // Step 1: Check Head
    const headId = this.memory.head;
    const headNode = this.memory.getNode(headId);

    // Check if head matches
    if (headNode.value == value) {
      this.stepEmitter.addStep(1, { ...variables }, { ...this.memory.getState(), highlights: [headId] }, `if (head->data == val)`);

      // Case: Only one node
      if (this.memory.getNext(headId) === headId) {
        this.memory.setHead(null);
        this.memory.setTail(null);
        this.memory.setCurr(null);
        this.memory.deleteNode(headId);
        this.stepEmitter.addStep(2, { ...variables, head: null }, this.memory.getState(), `head = tail = nullptr; delete head;`);
        return this.stepEmitter.getSteps();
      }

      // Case: Multiple Nodes (Delete Head)
      const newHead = headNode.next;
      const tail = this.memory.tail;

      // tail->next = newHead
      this.memory.setNext(tail, newHead);

      // head = newHead
      this.memory.setHead(newHead);

      this.memory.deleteNode(headId);

      this.stepEmitter.addStep(
        3,
        { ...variables, head: newHead },
        this.memory.getState(),
        `tail->next = head->next; head = head->next; delete oldHead;`
      );
      return this.stepEmitter.getSteps();
    }

    // Step 2: Traverse
    let curr = headId;
    let found = false;

    // We look for the node BEFORE the target to unlink it
    // Start checking from head->next

    this.stepEmitter.addStep(
      4,
      { ...variables, curr },
      { ...this.memory.getState(), highlights: [curr] },
      `Node* curr = head; while(curr->next != head)`
    );

    while (this.memory.getNode(curr).next !== headId) {
      const nextId = this.memory.getNode(curr).next;
      const nextNode = this.memory.getNode(nextId);

      if (nextNode.value == value) {
        found = true;

        // Found it at nextId
        const toDelete = nextId;
        const afterDelete = nextNode.next;

        // Unlink: curr->next = toDelete->next
        this.memory.setNext(curr, afterDelete);

        // Update Tail checking
        if (toDelete === this.memory.tail) {
          this.memory.setTail(curr);
          variables.tail = curr;
        }

        this.memory.deleteNode(toDelete);

        this.stepEmitter.addStep(
          5,
          { ...variables, curr },
          this.memory.getState(),
          `curr->next = curr->next->next; delete node;`
        );
        return this.stepEmitter.getSteps();
      }

      curr = nextId;
      this.stepEmitter.addStep(
        6,
        { ...variables, curr },
        { ...this.memory.getState(), highlights: [curr] },
        `curr = curr->next;`
      );
    }

    // Not found
    this.stepEmitter.addStep(7, { ...variables }, this.memory.getState(), `// Value not found`);
    return this.stepEmitter.getSteps();
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

  // Circular Singly: Move to Next (Next Track)
  circularSinglyMoveToNext() {
    const variables = { curr: this.memory.curr };

    if (!this.memory.curr) return this.stepEmitter.getSteps();

    const currId = this.memory.curr;
    const nextId = this.memory.getNode(currId).next;

    this.stepEmitter.addStep(
      1,
      { ...variables, next: nextId },
      { ...this.memory.getState(), highlights: [currId] },
      `// Moving to next track`
    );

    // Step 2: curr = curr->next
    this.memory.setCurr(nextId);

    this.stepEmitter.addStep(
      2,
      { ...variables, curr: nextId },
      { ...this.memory.getState(), highlights: [nextId] },
      `curr = curr->next;`
    );

    return this.stepEmitter.getSteps();
  }

  // Circular Singly: Move to Prev (Prev Track) - O(N)
  circularSinglyMoveToPrev() {
    const variables = { curr: this.memory.curr, temp: null };

    if (!this.memory.curr) return this.stepEmitter.getSteps();

    const currId = this.memory.curr;

    let temp = currId;
    this.stepEmitter.addStep(
      1,
      { ...variables, temp },
      { ...this.memory.getState(), highlights: [temp] },
      `Node* temp = curr;`
    );

    // Step 2: Traverse until temp->next == curr
    let nextOfTemp = this.memory.getNode(temp).next;
    let count = 0;

    // Safety break
    while (nextOfTemp !== currId && count < 20) {
      temp = nextOfTemp;
      nextOfTemp = this.memory.getNode(temp).next;

      this.stepEmitter.addStep(
        2,
        { ...variables, temp },
        { ...this.memory.getState(), highlights: [temp] },
        `while (temp->next != curr) { temp = temp->next; }`
      );
      count++;
    }

    // Step 3: curr = temp
    this.memory.setCurr(temp);

    this.stepEmitter.addStep(
      3,
      { ...variables, curr: temp },
      { ...this.memory.getState(), highlights: [temp] },
      `curr = temp; // Found previous node`
    );

    return this.stepEmitter.getSteps();
  }

  // Circular Doubly LL: Task Switcher + Generic
  executeCircularDoublyOperation(operation, params) {
    switch (operation) {
      // Application Specific
      case 'insertApp':
        return this.circularDoublyInsertHead(params.value); // Add app to front
      case 'openApp':
        return this.circularDoublyOpenApp(params.value); // Smart switch or launch
      case 'closeApp':
        return this.circularDoublyDeleteCurr(); // Close active app
      case 'moveToNext':
        return this.circularDoublyMoveToNext();
      case 'moveToPrev':
        return this.circularDoublyMoveToPrev();


      // Generic Operations
      case 'insertHead':
        return this.circularDoublyInsertHead(params.value);
      case 'insertTail':
        return this.circularDoublyInsertTail(params.value);
      case 'deleteHead':
        return this.circularDoublyDeleteHead();
      case 'deleteTail':
        return this.circularDoublyDeleteTail();
      case 'deleteValue':
        return this.circularDoublyDeleteValue(params.value);

      default:
        throw new Error(`Unknown circular doubly operation: ${operation}`);
    }
  }



  circularDoublyOpenApp(value) {
    if (!this.memory.head) {
      return this.circularDoublyInsertHead(value);
    }

    const variables = { value, curr: this.memory.head };
    let curr = this.memory.head;
    let found = false;
    const headId = this.memory.head;

    // 1. Search for existing app
    do {
      const node = this.memory.getNode(curr);
      if (node.value === value) {
        found = true;
        break;
      }
      curr = node.next;
    } while (curr !== headId);

    if (found) {
      // Switch to it
      this.stepEmitter.addStep(
        1,
        { ...variables, target: curr },
        { ...this.memory.getState(), highlights: [curr] },
        `// App is already running. Switching...`
      );

      this.memory.setCurr(curr);

      this.stepEmitter.addStep(
        2,
        { ...variables, curr },
        { ...this.memory.getState(), highlights: [curr] },
        `curr = foundApp;`
      );
      return this.stepEmitter.getSteps();
    } else {
      // Not found, launch new
      return this.circularDoublyInsertHead(value);
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
        this.memory.setCurr(newNodeId); // Automatically focus new head
        this.stepEmitter.addStep(6, { ...variables }, this.memory.getState(), `head = newNode; curr = head;`);
      } else {
        this.memory.setTail(newNodeId);
        this.stepEmitter.addStep(6, { ...variables }, this.memory.getState(), `tail = newNode;`);
      }
    }
    return this.stepEmitter.getSteps();
  }

  circularDoublyDeleteHead() {
    if (!this.memory.head) return [];
    return this.circularDoublyDeleteNode(this.memory.head);
  }

  circularDoublyDeleteTail() {
    if (!this.memory.tail) return [];
    return this.circularDoublyDeleteNode(this.memory.tail);
  }

  // Helper for deleting a specific node ID
  circularDoublyDeleteNode(nodeId) {
    const variables = { node: nodeId };
    const headId = this.memory.head;
    const tailId = this.memory.tail;

    this.stepEmitter.addStep(1, { ...variables }, { ...this.memory.getState(), highlights: [nodeId] }, `// Deleting node`);

    // Case: Single Node
    if (this.memory.getNext(nodeId) === nodeId) {
      this.memory.reset();
      this.stepEmitter.addStep(2, { ...variables }, this.memory.getState(), `head = tail = nullptr; delete node;`);
      return this.stepEmitter.getSteps();
    }

    const prev = this.memory.getPrev(nodeId);
    const next = this.memory.getNext(nodeId);

    // prev->next = next
    this.memory.setNext(prev, next);

    // next->prev = prev
    this.memory.setPrev(next, prev);

    this.stepEmitter.addStep(
      2,
      { ...variables },
      this.memory.getState(),
      `node->prev->next = node->next; node->next->prev = node->prev;`
    );

    // Update Head/Tail if we are deleting them
    if (nodeId === headId) {
      this.memory.setHead(next);
      this.stepEmitter.addStep(3, { ...variables, head: next }, this.memory.getState(), `head = node->next;`);
    }
    if (nodeId === tailId) {
      this.memory.setTail(prev);
      this.stepEmitter.addStep(3, { ...variables, tail: prev }, this.memory.getState(), `tail = node->prev;`);
    }

    // Update curr if needed (move to next usually)
    if (this.memory.curr === nodeId) {
      this.memory.setCurr(next);
    }

    this.memory.deleteNode(nodeId);
    this.stepEmitter.addStep(4, { ...variables }, this.memory.getState(), `delete node;`);

    return this.stepEmitter.getSteps();
  }

  circularDoublyDeleteCurr() {
    if (!this.memory.curr) return [];
    return this.circularDoublyDeleteNode(this.memory.curr);
  }

  circularDoublyDeleteValue(value) {
    const variables = { value, curr: this.memory.head };
    if (!this.memory.head) return [];

    let curr = this.memory.head;
    let found = false;
    let start = curr;

    this.stepEmitter.addStep(1, { ...variables, curr }, { ...this.memory.getState(), highlights: [curr] }, `Node* curr = head;`);

    do {
      const node = this.memory.getNode(curr);
      if (node.value == value) {
        found = true;
        this.stepEmitter.addStep(2, { ...variables, curr }, { ...this.memory.getState(), highlights: [curr] }, `// Found value`);
        return this.circularDoublyDeleteNode(curr);
      }
      curr = node.next;
      this.stepEmitter.addStep(2, { ...variables, curr }, { ...this.memory.getState(), highlights: [curr] }, `curr = curr->next;`);
    } while (curr !== start);

    this.stepEmitter.addStep(3, { ...variables }, this.memory.getState(), `// Value not found`);
    return this.stepEmitter.getSteps();
  }

  circularDoublyMoveToNext() {
    if (!this.memory.curr) return [];
    const next = this.memory.getNext(this.memory.curr);
    this.memory.setCurr(next);
    this.stepEmitter.addStep(1, { curr: next }, { ...this.memory.getState(), highlights: [next] }, `curr = curr->next;`);
    return this.stepEmitter.getSteps();
  }

  circularDoublyMoveToPrev() {
    if (!this.memory.curr) return [];
    const prev = this.memory.getPrev(this.memory.curr);
    this.memory.setCurr(prev);
    this.stepEmitter.addStep(1, { curr: prev }, { ...this.memory.getState(), highlights: [prev] }, `curr = curr->prev;`);
    return this.stepEmitter.getSteps();
  }

  // Helper: Reset the engine
  reset() {
    this.memory.reset();
    this.stepEmitter.clear();
  }

  // Helper: Get current memory state (Fixed missing method)
  getMemoryState() {
    return this.memory.getState();
  }
}
