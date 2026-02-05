/**
 * Doubly Linked List C++ Code Maps
 * Contains C++ code for doubly linked list operations
 */

export const doublyLLCode = {
  insertHead: [
    "Node* newNode = new Node(val);",
    "newNode->next = head;",
    "if (head != nullptr) {",
    "    head->prev = newNode;",
    "}",
    "head = newNode;",
    "if (tail == nullptr) {",
    "    tail = newNode;",
    "}"
  ],

  insertTail: [
    "Node* newNode = new Node(val);",
    "newNode->prev = tail;",
    "if (tail != nullptr) {",
    "    tail->next = newNode;",
    "}",
    "tail = newNode;",
    "if (head == nullptr) {",
    "    head = newNode;",
    "}"
  ],

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

  traverse: [
    "Node* current = head;",
    "while (current != nullptr) {",
    "    cout << current->data << \" \";",
    "    current = current->next;",
    "}"
  ]
};

export function getDoublyLLCode(operation) {
  return doublyLLCode[operation] || [];
}

export const doublyLLClassDefinition = `
struct Node {
    int data;
    Node* next;
    Node* prev;
    
    Node(int val) : data(val), next(nullptr), prev(nullptr) {}
};

class DoublyLinkedList {
private:
    Node* head;
    Node* tail;
    
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr) {}
    
    void insertHead(int val);
    void insertTail(int val);
    void deleteHead();
    void deleteTail();
    void traverse();
};
`;
