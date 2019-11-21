class _Node {
  constructor(value, next) {
    this.value=value,
    this.next=next;
  }
 }

class LinkedList {
  constructor() {
    this.total_score = 0;
    this.head = null;
    
  }

  insertFirst(item){
    this.head = new _Node(item, this.head);
  }

  insertLast(item){
    if(this.head === null){
      this.insertFirst(item);
    }
    else{
      let tempNode = this.head;
      while(tempNode.next !== null){
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  insertAfter(key, itemToInsert){
    let tempNode = this.head;
    while(tempNode !== null && tempNode.value !== key){
      tempNode = tempNode.next;
    }
    if(tempNode !== null){
      tempNode.next = new _Node(itemToInsert, tempNode.next);
    }
  }
  insertBefore(key, itemToInsert){
    if(this.head == null){
      return;
    }
    if(this.head.value == key){
      this.insertFirst(itemToInsert);
      return;
    }
    let prevNode = null;
    let currNode = this.head;
    while(currNode !== null && currNode.value !== key){
      prevNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null){
      console.log('Node not found to insert');
      return;
    }
    prevNode.next = new _Node(itemToInsert, currNode);
  }
  insertAt(nthPosition, itemToInsert) {
    if (nthPosition < 0) {
      throw new Error('Position error');
    }
    if (nthPosition === 0) {
      this.insertFirst(itemToInsert);
    }else {
      const node = this._findNthElement(nthPosition - 1);
      const newNode = new _Node(itemToInsert, null);
      newNode.next = node.next;
      node.next = newNode;
    }
  }
  _findNthElement(position) {
    let node = this.head;
    for (let i=0; i<position; i++) {
      node = node.next;
    }
    return node;
  }
  remove(item){
    if (!this.head){
      return null;
    }
    if(this.head === item){
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;
    while ((currNode !== null) && (currNode.value !== item)) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null){
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }
  find(item) {
    let currNode = this.head;
    if (!this.head){
      return null;
    }
    while(currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      }
      else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  moveHeadBy(level) {
    let head = this.head;
    this.head = this.head.next;
    this.insertAt(level, head.value)
  }

  listNodes() {
    let node = this.head;
    const arr = [];
    while(node) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  }

  map(callback) {
    let node = this.head
    let arr = []
    while (node) {
      arr.push(callback(node))
      node = node.next
    }
    return arr
  }

  forEach(cb) {               // when we call this method, we would also pass the callback instruction to update in db!
    let node = this.head;     // start by creating a copy of the node at the top of our list
    const arr = [];           // create an empty Array, so we can push each db update to it
    while (node) {            // iterate over all nodes
      arr.push(cb(node))
      node = node.next
    }
    return arr;               // return an Array with each update callback within
  }

  size(list) {
    let nodeCounter = 1;
    if (list.head === null) {
      return console.log("Empty list");
    }
    let currentNode = list.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
      nodeCounter++;
    }
    return nodeCounter;
  }

  UpdateScoreAndSLL(guess, SLL) {
    let length = this.size(SLL);
    if (SLL.head.value.translation.toUpperCase() === guess.toUpperCase()) {
      SLL.head.value.memory_value += 1;
      SLL.head.value.correct_count += 1;
      SLL.total_score++;
      if (SLL.head.value.memory_value > length) {
        SLL.moveHeadBy(length - 1);
      } else {
        SLL.moveHeadBy(SLL.head.value.memory_value);
      }
    } else {
      SLL.head.value.memory_value = 1;
      SLL.head.value.incorrect_count += 1;
      //Remove if no decrementing needed for total_score
      SLL.total_score--;
      if (SLL.head.value.memory_value > length) {
        SLL.moveHeadBy(length - 1);
      } else {
        SLL.moveHeadBy(SLL.head.value.memory_value);
      }
    }
    //console.log(SLL)
    return SLL;
  }

  // updateTotaltotal_score() {
  //   let node = this.head;
  //   let total_score = 0;
  //   while (node !== null) {
  //     total_score += node.value.correct_count;
  //     node = node.next;
  //   }
  //   return total_score;
  // }

  isCorrect(guess, list){
    if (list.head.value.translation.toUpperCase() === guess.toUpperCase()) {
      return true
  } else { 
      return false
  }
}

  arrToSLL(arr, list){
    arr.forEach(element => {
      list.insertLast(element)
    });
    return list
  }

  displayTranslation() {
    let node = this.head;
    while (node !== null) {
      console.log(node.value.translation);
      node = node.next;
    }
    return;
  }

}

module.exports = LinkedList