/**
 * Singly Linked List C++ Code Maps
 * These contain the actual C++ code that students would see in textbooks
 * Each operation is mapped to line numbers for highlighting
 */

export const singlyLLCode = {
  // Insert at Head
  insertHead: [
    "Node* newNode = new Node(val);",
    "newNode->next = head;",
    "head = newNode;",
    "// Insert complete"
  ],

  // Insert at Tail
  insertTail: [
    "Node* newNode = new Node(val);",
    "if (head == nullptr) {",
    "    head = tail = newNode;",
    "} else {",
    "    tail->next = newNode;",
    "    tail = newNode;",
    "}",
    "// Insert complete"
  ],

  // Insert at Position
  insertAt: [
    "Node* newNode = new Node(val);",
    "if (pos == 0) {",
    "    newNode->next = head;",
    "    head = newNode;",
    "    return;",
    "}",
    "Node* temp = head;",
    "for (int i = 0; i < pos - 1 && temp != nullptr; i++) {",
    "    temp = temp->next;",
    "}",
    "if (temp == nullptr) return;",
    "newNode->next = temp->next;",
    "temp->next = newNode;"
  ],

  // Delete Head
  deleteHead: [
    "if (head == nullptr) return;",
    "Node* temp = head;",
    "head = head->next;",
    "delete temp;",
    "// Delete complete"
  ],

  // Delete Tail
  deleteTail: [
    "if (head == nullptr) return;",
    "if (head->next == nullptr) {",
    "    delete head;",
    "    head = tail = nullptr;",
    "    return;",
    "}",
    "Node* temp = head;",
    "while (temp->next != tail) {",
    "    temp = temp->next;",
    "}",
    "delete tail;",
    "tail = temp;",
    "tail->next = nullptr;"
  ],

  // Delete by Value
  deleteValue: [
    "if (head == nullptr) return;",
    "if (head->data == val) {",
    "    Node* temp = head;",
    "    head = head->next;",
    "    delete temp;",
    "    return;",
    "}",
    "Node* curr = head;",
    "while (curr->next != nullptr && curr->next->data != val) {",
    "    curr = curr->next;",
    "}",
    "if (curr->next == nullptr) return;",
    "Node* temp = curr->next;",
    "curr->next = curr->next->next;",
    "delete temp;"
  ],

  // Traverse
  traverse: [
    "Node* current = head;",
    "while (current != nullptr) {",
    "    cout << current->data << \" \";",
    "    current = current->next;",
    "}",
    "// Traversal complete"
  ],

  // Reverse
  reverse: [
    "if (head == nullptr || head->next == nullptr) return;",
    "Node* prev = nullptr;",
    "Node* current = head;",
    "Node* next = nullptr;",
    "while (current != nullptr) {",
    "    next = current->next;",
    "    current->next = prev;",
    "    prev = current;",
    "    current = next;",
    "}",
    "head = prev;",
    "// Reverse complete"
  ]
};

// Helper function to get code for an operation
export function getSinglyLLCode(operation) {
  return singlyLLCode[operation] || [];
}

// Get full class definition for reference
export const singlyLLClassDefinition = `
struct Node {
    int data;
    Node* next;
    
    Node(int val) : data(val), next(nullptr) {}
};

class SinglyLinkedList {
private:
    Node* head;
    Node* tail;
    
public:
    SinglyLinkedList() : head(nullptr), tail(nullptr) {}
    
    void insertHead(int val);
    void insertTail(int val);
    void insertAt(int val, int pos);
    void deleteHead();
    void deleteTail();
    void deleteValue(int val);
    void traverse();
    void reverse();
};
`;
