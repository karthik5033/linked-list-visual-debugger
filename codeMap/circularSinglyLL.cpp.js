/**
 * Circular Singly Linked List C++ Code Maps
 */

export const circularSinglyLLCode = {
  insertHead: [
    "Node* newNode = new Node(val);",
    "if (head == nullptr) {",
    "    head = newNode;",
    "    newNode->next = head;",
    "} else {",
    "    Node* tail = head;",
    "    while (tail->next != head) {",
    "        tail = tail->next;",
    "    }",
    "    newNode->next = head;",
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

export function getCircularSinglyLLCode(operation) {
  return circularSinglyLLCode[operation] || [];
}
