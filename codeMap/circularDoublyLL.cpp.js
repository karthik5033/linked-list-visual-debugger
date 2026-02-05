/**
 * Circular Doubly Linked List C++ Code Maps
 */

export const circularDoublyLLCode = {
  insertHead: [
    "Node* newNode = new Node(val);",
    "if (head == nullptr) {",
    "    head = newNode;",
    "    newNode->next = newNode;",
    "    newNode->prev = newNode;",
    "} else {",
    "    Node* tail = head->prev;",
    "    newNode->next = head;",
    "    newNode->prev = tail;",
    "    head->prev = newNode;",
    "    tail->next = newNode;",
    "    head = newNode;",
    "}"
  ],

  traverse: [
    "if (head == nullptr) return;",
    "Node* current = head;",
    "do {",
    "    cout << current->data << \" \";",
    "    current = current->next;",
    "} while (current != head);"
  ]
};

export function getCircularDoublyLLCode(operation) {
  return circularDoublyLLCode[operation] || [];
}
