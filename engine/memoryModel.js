/**
 * Memory Model
 * Maintains the state of nodes, pointers, and variables
 * This is NOT UI - this is pure data representation
 */

export class MemoryModel {
  constructor() {
    this.nodes = {}; // { nodeId: { value, next, prev } }
    this.head = null;
    this.tail = null;
    this.curr = null; // Current position (for DLL browser history)
    this.nodeCounter = 0;
  }

  // Create a new node and return its ID
  createNode(value) {
    const nodeId = `node_${this.nodeCounter++}`;
    this.nodes[nodeId] = {
      id: nodeId,
      value: value,
      next: null,
      prev: null, // for doubly linked lists
    };
    return nodeId;
  }

  // Get node by ID
  getNode(nodeId) {
    return this.nodes[nodeId];
  }

  // Set next pointer
  setNext(nodeId, nextNodeId) {
    if (this.nodes[nodeId]) {
      this.nodes[nodeId].next = nextNodeId;
    }
  }

  // Set prev pointer (for doubly linked lists)
  setPrev(nodeId, prevNodeId) {
    if (this.nodes[nodeId]) {
      this.nodes[nodeId].prev = prevNodeId;
    }
  }

  // Delete a node
  deleteNode(nodeId) {
    delete this.nodes[nodeId];
  }

  // Set head pointer
  setHead(nodeId) {
    this.head = nodeId;
  }

  // Set tail pointer
  setTail(nodeId) {
    this.tail = nodeId;
  }

  // Set current pointer (for DLL)
  setCurr(nodeId) {
    this.curr = nodeId;
  }

  // Get current state snapshot
  getState() {
    // Deep copy nodes to ensure history steps don't share references
    const nodesCopy = {};
    for (const [id, node] of Object.entries(this.nodes)) {
      nodesCopy[id] = { ...node };
    }
    
    return {
      nodes: nodesCopy,
      head: this.head,
      tail: this.tail,
      curr: this.curr,
    };
  }

  // Reset the entire memory
  reset() {
    this.nodes = {};
    this.head = null;
    this.tail = null;
    this.curr = null;
    this.nodeCounter = 0;
  }

  // Get all nodes as array (for visualization)
  getNodesArray() {
    const result = [];
    let current = this.head;
    const visited = new Set();

    while (current && !visited.has(current)) {
      visited.add(current);
      result.push(this.nodes[current]);
      current = this.nodes[current]?.next;
    }

    return result;
  }
}
