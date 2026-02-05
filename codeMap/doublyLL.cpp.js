/**
 * Doubly Linked List C++ Code Maps
 */

export const doublyLLCode = {
  // Insert at Head
  insertHead: [
    "Node* newNode = new Node(val);",
    "if (head == nullptr) {",
    "    head = tail = newNode;",
    "} else {",
    "    newNode->next = head;",
    "    head->prev = newNode;",
    "    head = newNode;",
    "}",
    "// Insert complete"
  ],

  // Insert at Tail
  insertTail: [
    "Node* newNode = new Node(val);",
    "if (tail == nullptr) {",
    "    head = tail = newNode;",
    "} else {",
    "    tail->next = newNode;",
    "    newNode->prev = tail;",
    "    tail = newNode;",
    "}",
    "// Insert complete"
  ],

  // Delete Head
  deleteHead: [
    "if (head == nullptr) return;",
    "Node* temp = head;",
    "head = head->next;",
    "if (head != nullptr) {",
    "    head->prev = nullptr;",
    "} else {",
    "    tail = nullptr;",
    "}",
    "delete temp;"
  ],

  // Delete Tail
  deleteTail: [
    "if (tail == nullptr) return;",
    "Node* temp = tail;",
    "tail = tail->prev;",
    "if (tail != nullptr) {",
    "    tail->next = nullptr;",
    "} else {",
    "    head = nullptr;",
    "}",
    "delete temp;"
  ],

  // Delete Value
  deleteValue: [
    "Node* curr = head;",
    "while (curr != nullptr && curr->data != val) {",
    "    curr = curr->next;",
    "}",
    "if (curr == nullptr) return;",
    "if (curr->prev) curr->prev->next = curr->next;",
    "else head = curr->next;",
    "if (curr->next) curr->next->prev = curr->prev;",
    "else tail = curr->prev;",
    "delete curr;"
  ],

  // Search
  search: [
    "Node* current = head;",
    "int index = 0;",
    "while (current != nullptr) {",
    "    if (current->data == val) return index;",
    "    current = current->next;",
    "    index++;",
    "}",
    "return -1;"
  ]
};

export function getDoublyLLCode(operation) {
  return doublyLLCode[operation] || [];
}
