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
      case 'insertAt':
        return this.singlyInsertAt(params.value, params.position);
      case 'deleteValue':
        return this.singlyDeleteValue(params.value);
      case 'deleteHead':
        return this.singlyDeleteHead();
      case 'deleteTail':
        return this.singlyDeleteTail();
      case 'traverse':
        return this.singlyTraverse();
      case 'reverse':
        return this.singlyReverse();
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  // Singly Linked List: Insert at Head
  singlyInsertHead(value) {
    const variables = { value, newNode: null, head: this.memory.head };

    // Step 1: Create new node
    this.stepEmitter.addStep(
      0,
      { ...variables },
      this.memory.getState(),
      `Creating new node with value ${value}`
    );

    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    // Step 2: newNode->next = head
    this.stepEmitter.addStep(
      1,
      { ...variables },
      this.memory.getState(),
      `Setting newNode->next to current head`
    );

    this.memory.setNext(newNodeId, this.memory.head);

    // Step 3: head = newNode
    this.stepEmitter.addStep(
      2,
      { ...variables },
      this.memory.getState(),
      `Updating head to point to newNode`
    );

    this.memory.setHead(newNodeId);
    variables.head = newNodeId;

    // If this was the first node, also set tail
    if (!this.memory.tail) {
      this.memory.setTail(newNodeId);
    }

    // Final step
    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `Insert complete`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Insert at Tail
  singlyInsertTail(value) {
    const variables = { value, newNode: null, tail: this.memory.tail };

    // Step 1: Create new node
    this.stepEmitter.addStep(
      0,
      { ...variables },
      this.memory.getState(),
      `Creating new node with value ${value}`
    );

    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    // If list is empty
    if (!this.memory.head) {
      this.stepEmitter.addStep(
        1,
        { ...variables },
        this.memory.getState(),
        `List is empty, setting head and tail to newNode`
      );
      
      this.memory.setHead(newNodeId);
      this.memory.setTail(newNodeId);
    } else {
      // Step 2: tail->next = newNode
      this.stepEmitter.addStep(
        1,
        { ...variables },
        this.memory.getState(),
        `Setting tail->next to newNode`
      );

      this.memory.setNext(this.memory.tail, newNodeId);

      // Step 3: tail = newNode
      this.stepEmitter.addStep(
        2,
        { ...variables },
        this.memory.getState(),
        `Updating tail to point to newNode`
      );

      this.memory.setTail(newNodeId);
      variables.tail = newNodeId;
    }

    // Final step
    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `Insert complete`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Delete Head
  singlyDeleteHead() {
    const variables = { head: this.memory.head, temp: null };

    if (!this.memory.head) {
      this.stepEmitter.addStep(
        0,
        { ...variables },
        this.memory.getState(),
        `List is empty, nothing to delete`
      );
      return this.stepEmitter.getSteps();
    }

    // Step 1: temp = head
    variables.temp = this.memory.head;
    this.stepEmitter.addStep(
      0,
      { ...variables },
      this.memory.getState(),
      `Storing head in temp`
    );

    // Step 2: head = head->next
    const nextNode = this.memory.getNode(this.memory.head).next;
    this.stepEmitter.addStep(
      1,
      { ...variables, nextNode },
      this.memory.getState(),
      `Moving head to next node`
    );

    this.memory.setHead(nextNode);
    variables.head = nextNode;

    // Step 3: delete temp
    this.stepEmitter.addStep(
      2,
      { ...variables },
      this.memory.getState(),
      `Deleting old head node`
    );

    this.memory.deleteNode(variables.temp);

    // If list is now empty, clear tail
    if (!this.memory.head) {
      this.memory.setTail(null);
    }

    // Final step
    this.stepEmitter.addStep(
      3,
      { ...variables },
      this.memory.getState(),
      `Delete complete`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Traverse
  singlyTraverse() {
    const variables = { current: this.memory.head };

    this.stepEmitter.addStep(
      0,
      { ...variables },
      this.memory.getState(),
      `Starting traversal from head`
    );

    let current = this.memory.head;
    let stepLine = 1;

    while (current) {
      variables.current = current;
      this.stepEmitter.addStep(
        stepLine,
        { ...variables },
        this.memory.getState(),
        `Visiting node with value ${this.memory.getNode(current).value}`
      );

      current = this.memory.getNode(current).next;
      stepLine++;
    }

    this.stepEmitter.addStep(
      stepLine,
      { current: null },
      this.memory.getState(),
      `Traversal complete`
    );

    return this.stepEmitter.getSteps();
  }

  // Singly Linked List: Reverse
  singlyReverse() {
    const variables = { 
      prev: null, 
      current: this.memory.head, 
      next: null 
    };

    if (!this.memory.head || !this.memory.getNode(this.memory.head).next) {
      this.stepEmitter.addStep(
        0,
        { ...variables },
        this.memory.getState(),
        `List has 0 or 1 nodes, no reversal needed`
      );
      return this.stepEmitter.getSteps();
    }

    // Initial step
    this.stepEmitter.addStep(
      0,
      { ...variables },
      this.memory.getState(),
      `Initialize: prev=null, current=head`
    );

    let prev = null;
    let current = this.memory.head;
    const originalTail = this.memory.head;
    let stepLine = 1;

    while (current) {
      // Save next
      const next = this.memory.getNode(current).next;
      variables.next = next;

      this.stepEmitter.addStep(
        stepLine++,
        { ...variables, prev, current },
        this.memory.getState(),
        `Save next pointer`
      );

      // Reverse the link
      this.memory.setNext(current, prev);

      this.stepEmitter.addStep(
        stepLine++,
        { ...variables, prev, current },
        this.memory.getState(),
        `Reverse current->next to point to prev`
      );

      // Move pointers
      prev = current;
      current = next;
      variables.prev = prev;
      variables.current = current;

      this.stepEmitter.addStep(
        stepLine++,
        { ...variables },
        this.memory.getState(),
        `Move prev and current forward`
      );
    }

    // Update head and tail
    this.memory.setHead(prev);
    this.memory.setTail(originalTail);

    this.stepEmitter.addStep(
      stepLine,
      { head: prev, tail: originalTail },
      this.memory.getState(),
      `Update head to point to new first node`
    );

    return this.stepEmitter.getSteps();
  }

  // Placeholder methods for other list types
  // Doubly Linked List Operations
  executeDoublyOperation(operation, params) {
    switch (operation) {
      case 'insertHead':
        return this.doublyInsertHead(params.value);
      case 'insertTail':
        return this.doublyInsertTail(params.value);
      case 'deleteHead':
        return this.doublyDeleteHead();
      default:
        throw new Error(`Operation ${operation} not yet implemented for Doubly Linked List`);
    }
  }

  // Doubly: Insert Head
  doublyInsertHead(value) {
    const variables = { value, newNode: null, head: this.memory.head };
    
    // Step 1: Create Node
    this.stepEmitter.addStep(0, {...variables}, this.memory.getState(), `Creating new node ${value}`);
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    // Step 2: newNode->next = head
    this.stepEmitter.addStep(1, {...variables}, this.memory.getState(), `Linking newNode->next to head`);
    this.memory.setNext(newNodeId, this.memory.head);

    // Step 3: if head != null, head->prev = newNode
    if (this.memory.head) {
      this.stepEmitter.addStep(2, {...variables}, this.memory.getState(), `Setting current head->prev to newNode`);
      this.memory.setPrev(this.memory.head, newNodeId);
    }

    // Step 4: head = newNode
    this.stepEmitter.addStep(3, {...variables}, this.memory.getState(), `Updating head pointer`);
    this.memory.setHead(newNodeId);
    variables.head = newNodeId;

    // Step 5: Handle tail
    if (!this.memory.tail) {
      this.stepEmitter.addStep(4, {...variables}, this.memory.getState(), `List was empty, setting tail = newNode`);
      this.memory.setTail(newNodeId);
    }

    return this.stepEmitter.getSteps();
  }

  // Doubly: Insert Tail
  doublyInsertTail(value) {
    const variables = { value, newNode: null, tail: this.memory.tail };

    // Step 1: Create Node
    this.stepEmitter.addStep(0, {...variables}, this.memory.getState(), `Creating new node ${value}`);
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;

    // Step 2: newNode->prev = tail
    this.stepEmitter.addStep(1, {...variables}, this.memory.getState(), `Linking newNode->prev to tail`);
    this.memory.setPrev(newNodeId, this.memory.tail);

    // Step 3: if tail != null, tail->next = newNode
    if (this.memory.tail) {
      this.stepEmitter.addStep(2, {...variables}, this.memory.getState(), `Setting current tail->next to newNode`);
      this.memory.setNext(this.memory.tail, newNodeId);
    }

    // Step 4: tail = newNode
    this.stepEmitter.addStep(3, {...variables}, this.memory.getState(), `Updating tail pointer`);
    this.memory.setTail(newNodeId);
    variables.tail = newNodeId;

    // Step 5: Handle head
    if (!this.memory.head) {
      this.stepEmitter.addStep(4, {...variables}, this.memory.getState(), `List was empty, setting head = newNode`);
      this.memory.setHead(newNodeId);
    }

    return this.stepEmitter.getSteps();
  }

  // Doubly: Delete Head
  doublyDeleteHead() {
    const variables = { head: this.memory.head, temp: null };
    
    if (!this.memory.head) return this.stepEmitter.getSteps();

    // Step 1: temp = head
    variables.temp = this.memory.head;
    this.stepEmitter.addStep(0, {...variables}, this.memory.getState(), `Marking head node to delete`);

    // Step 2: head = head->next
    const nextNode = this.memory.getNode(this.memory.head).next;
    this.memory.setHead(nextNode);
    this.stepEmitter.addStep(1, {...variables, head: nextNode}, this.memory.getState(), `Advancing head pointer`);

    // Step 3: if head != nullptr, head->prev = nullptr
    if (nextNode) {
      this.memory.setPrev(nextNode, null);
      this.stepEmitter.addStep(2, {...variables, head: nextNode}, this.memory.getState(), `Clearing new head's prev pointer`);
    } else {
      this.memory.setTail(null); // List became empty
      this.stepEmitter.addStep(2, {...variables, head: null}, this.memory.getState(), `List is now empty, clearing tail`);
    }

    // Step 4: delete temp
    this.memory.deleteNode(variables.temp);
    this.stepEmitter.addStep(3, {...variables}, this.memory.getState(), `Memory deallocated`);

    return this.stepEmitter.getSteps();
  }

  // Helper: Reset the engine
  reset() {
    this.memory.reset();
    this.stepEmitter.clear();
  }

  // Helper: Get current memory state
  getMemoryState() {
    return this.memory.getState();
  }
}
