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
      this.stepEmitter.addStep(0, {...variables}, this.memory.getState(), `if (head == nullptr) return;`);
      return this.stepEmitter.getSteps();
    }

    // Case 1: Single node
    if (this.memory.head === this.memory.tail) {
      this.stepEmitter.addStep(1, {...variables}, this.memory.getState(), `if (head == tail) { delete head; head = tail = nullptr; }`);
      this.memory.deleteNode(this.memory.head);
      this.memory.setHead(null);
      this.memory.setTail(null);
      return this.stepEmitter.getSteps();
    }

    // Case 2: Traversing to find second-to-last
    let current = this.memory.head;
    let stepLine = 2;
    
    this.stepEmitter.addStep(stepLine, {...variables}, this.memory.getState(), `Node* current = head;`);

    // Ensure we have a next node to check
    while (this.memory.getNode(current).next !== this.memory.tail) {
      current = this.memory.getNode(current).next;
      variables.current = current;
      this.stepEmitter.addStep(stepLine++, {...variables}, this.memory.getState(), `while(current->next != tail) { current = current->next; }`);
    }

    variables.current = current;

    // Action: Set current->next to null
    this.memory.setNext(current, null);
    
    this.stepEmitter.addStep(stepLine++, {...variables}, this.memory.getState(), `current->next = nullptr;`);

    // Delete old tail
    this.memory.deleteNode(this.memory.tail);
    this.stepEmitter.addStep(stepLine++, {...variables}, this.memory.getState(), `delete tail;`);
    
    // Update tail pointer
    this.memory.setTail(current);
    variables.tail = current;
    
    this.stepEmitter.addStep(stepLine, {...variables}, this.memory.getState(), `tail = current;`);

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
    this.stepEmitter.addStep(1, {...variables}, this.memory.getState(), `Node* newNode = new Node(${value});`);

    // Action 2: newNode->next = head
    this.memory.setNext(newNodeId, this.memory.head);
    this.stepEmitter.addStep(2, {...variables}, this.memory.getState(), `newNode->next = head;`);

    // Action 3: if head != null, head->prev = newNode
    if (this.memory.head) {
      this.memory.setPrev(this.memory.head, newNodeId);
      this.stepEmitter.addStep(3, {...variables}, this.memory.getState(), `head->prev = newNode;`);
    }

    // Action 4: head = newNode
    this.memory.setHead(newNodeId);
    variables.head = newNodeId;
    this.stepEmitter.addStep(4, {...variables}, this.memory.getState(), `head = newNode;`);

    // Action 5: Handle tail
    if (!this.memory.tail) {
      this.memory.setTail(newNodeId);
      this.stepEmitter.addStep(5, {...variables}, this.memory.getState(), `tail = newNode; // List was empty`);
    }

    return this.stepEmitter.getSteps();
  }

  // Doubly: Insert Tail
  doublyInsertTail(value) {
    const variables = { value, newNode: null, tail: this.memory.tail };

    // Action 1: Create Node
    const newNodeId = this.memory.createNode(value);
    variables.newNode = newNodeId;
    this.stepEmitter.addStep(1, {...variables}, this.memory.getState(), `Node* newNode = new Node(${value});`);

    // Action 2: newNode->prev = tail
    this.memory.setPrev(newNodeId, this.memory.tail);
    this.stepEmitter.addStep(2, {...variables}, this.memory.getState(), `newNode->prev = tail;`);

    // Action 3: if tail != null, tail->next = newNode
    if (this.memory.tail) {
      this.memory.setNext(this.memory.tail, newNodeId);
      this.stepEmitter.addStep(3, {...variables}, this.memory.getState(), `tail->next = newNode;`);
    }

    // Action 4: tail = newNode
    this.memory.setTail(newNodeId);
    variables.tail = newNodeId;
    this.stepEmitter.addStep(4, {...variables}, this.memory.getState(), `tail = newNode;`);

    // Action 5: Handle head
    if (!this.memory.head) {
      this.memory.setHead(newNodeId);
      this.stepEmitter.addStep(5, {...variables}, this.memory.getState(), `head = newNode; // List was empty`);
    }

    return this.stepEmitter.getSteps();
  }

  // Doubly: Delete Head
  doublyDeleteHead() {
    const variables = { head: this.memory.head, temp: null };
    
    if (!this.memory.head) return this.stepEmitter.getSteps();

    // Action 1: temp = head
    variables.temp = this.memory.head;
    this.stepEmitter.addStep(1, {...variables}, this.memory.getState(), `Node* temp = head;`);

    // Action 2: head = head->next
    const nextNode = this.memory.getNode(this.memory.head).next;
    this.memory.setHead(nextNode);
    variables.head = nextNode;
    this.stepEmitter.addStep(2, {...variables}, this.memory.getState(), `head = head->next;`);

    // Action 3: if head != nullptr, head->prev = nullptr
    if (nextNode) {
      this.memory.setPrev(nextNode, null);
      this.stepEmitter.addStep(3, {...variables}, this.memory.getState(), `if (head) head->prev = nullptr;`);
    } else {
      this.memory.setTail(null); // List became empty
      this.stepEmitter.addStep(3, {...variables, head: null}, this.memory.getState(), `tail = nullptr; // List empty`);
    }

    // Action 4: delete temp
    this.memory.deleteNode(variables.temp);
    this.stepEmitter.addStep(4, {...variables}, this.memory.getState(), `delete temp;`);

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
