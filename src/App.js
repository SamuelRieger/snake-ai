import React, { useEffect, useState } from "react";
import Snake from './components/Snake.js';
import Apple from './components/Apple.js';
import { findAllByDisplayValue } from "@testing-library/react";

function App() {

  // Get a random coordinate for the apple where the snake's body does not occupy.
  const getRandomCoordinates = () => {
    let freeGridSpaces = getFreeGridSpaces();
    let gridCode = Math.floor((Math.random() * freeGridSpaces.length));

    return [Math.floor(freeGridSpaces[gridCode] / 50), freeGridSpaces[gridCode] % 50];
  }

  // Get all the spaces on the board that the snake body does not occupy.
  const getFreeGridSpaces = () => {
    let gridSpaces = Array.from(Array(gridSize * gridSize).keys());

    for (var i = snakeCoordinates.length - 1; i >= 0; i--) {
      let key = snakeCoordinates[i][1] + snakeCoordinates[i][0] * gridSize;
      gridSpaces.splice(key, 1);
    }
    
    return gridSpaces;
  }

  //State variable declerations. ******
  const [pixelGridSize, setPixelGridSize] = useState(500);
  const [gridSize, setGridSize] = useState(50);

  const [snakeCoordinates, setSnakeCoordinates] = useState(
    [
      [0, 0],
      [0, 1]
    ]
  );

  const [direction, setDirection] = useState('RIGHT');

  const [speed, setSpeed] = useState(100);

  const [appleCoordinates, setAppleCoordinates] = useState(getRandomCoordinates());

  const [update, setUpdate] = useState(0);
  // ***********************************

  // Reset the game once it is over.
  const resetGame = () => {
    setSnakeCoordinates(
      [
        [0, 0],
        [0, 1]
      ]
    );
    setDirection('RIGHT');
    setUpdate(0);
    setAppleCoordinates(getRandomCoordinates());
  }

  // Animate and update the cells that the snake occupys.
  const moveSnake = () => {
    let body = snakeCoordinates;
    let head = body[body.length - 1];

    switch (direction) {
      case 'RIGHT':
        head = [head[0], head[1] + 1];
        break;
      case 'LEFT':
        head = [head[0], head[1] - 1];
        break;
      case 'DOWN':
        head = [head[0] + 1, head[1]];
        break;
      case 'UP':
        head = [head[0] - 1, head[1]];
    }
    body.push(head);
    body.shift();
    setSnakeCoordinates(body);
    setUpdate(update => update + 1);
  }

  // SNAKE AI LOGIC //
  //****************//

  class Node {
	  constructor(row, col, value) {
      this.id = row.toString() + "-" + col.toString();
      this.row = row;
      this.col = col;
      this.value = value;
      this.distanceFromStart = Number.POSITIVE_INFINITY; // g
      this.estimatedDistanceToEnd = Number.POSITIVE_INFINITY; // f
      this.cameFrom = null;
    }
  }

  function snakeLogic() {
    // Snake algorithms and logic.
    var startRow = snakeCoordinates[snakeCoordinates.length - 1][0];
    var startCol = snakeCoordinates[snakeCoordinates.length - 1][1];
    var endRow = appleCoordinates[0];
    var endCol = appleCoordinates[1];
      // Greedy best first search.
      // A* algorithm.
      aStar(startRow, startCol, endRow, endCol, initializeGraph());
      // Almighty move algorithm.
  }
  function initializeGraph() {
    var graph = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
      graph[i] = new Array(gridSize);
      graph[i].fill(0);
    }
    for (var i = 0; i < snakeCoordinates.length; i++) {
      if (snakeCoordinates[i].length == 0) {
        continue;
      }
      var currentRow = snakeCoordinates[i][0];
      var currentCol = snakeCoordinates[i][1];

      console.log(snakeCoordinates);

      graph[currentRow][currentCol] = 1;
    }

    return graph;
  }
  function aStar(startRow, startCol, endRow, endCol, graph) {
    var nodes = initializeNodes(graph)

    var startNode = nodes[startRow][startCol];
    var endNode = nodes[endRow][endCol]

    startNode.distanceFromStart = 0;
    startNode.estimatedDistanceToEnd = getManhattanDistance(startNode, endNode);

    var nodesToVisit = new MinHeap([startNode]);

    while (!nodesToVisit.isEmpty()) {
      var currentMinDistanceNode = nodesToVisit.remove();

      if (currentMinDistanceNode == endNode) {
        break;
      }

      var neighbors = getNeighboringNodes(currentMinDistanceNode, nodes)
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (neighbor.value == 1) {
          continue;
        }

        var tentativeDistanceToNeighbor = currentMinDistanceNode.distanceFromStart + 1;

        if (tentativeDistanceToNeighbor >= neighbor.distanceFromStart) {
          continue;
        }

        neighbor.cameFrom = currentMinDistanceNode;
        neighbor.distanceFromStart = tentativeDistanceToNeighbor;
        neighbor.estimatedDistanceToEnd = tentativeDistanceToNeighbor + getManhattanDistance(neighbor, endNode);  

        if (!nodesToVisit.containsNode(neighbor)) {
          nodesToVisit.insert(neighbor);
        } else {
          nodesToVisit.update(neighbor);
        }
      }
    }
    reconstructPath(endNode); // Returns all the nodes in order from end node to start node.
  }
  function initializeNodes(graph) {
    var nodes = new Array();

    for (var i = 0; i < graph.length; i++) {
      nodes.push([]);
      for (var j = 0; j < graph[i].length; j++) {
        nodes[i].push(new Node(i, j, graph[i][j]));
      }
    }

    return nodes;
  }
  function getManhattanDistance(currentNode, endNode) {
    var currentRow = currentNode.row;
    var currentCol = currentNode.col;
    var endRow = endNode.row;
    var endCol = endNode.col;

    return Math.abs(endRow - currentRow) + Math.abs(endCol - currentCol);
  }
  function getNeighboringNodes(node,nodes) {
    var neighbors = [];

    var numRows = nodes.length;
    var numCols = nodes[0].length;

    var row = node.row;
    var col = node.col;

    if (row < numRows - 1) {
      neighbors.push(nodes[row + 1][col]);
    }
    if (row > 0) {
      neighbors.push(nodes[row - 1][col]);
    }
    if (col < numCols - 1) {
      neighbors.push(nodes[row][col + 1]);
    }
    if (col > 0) {
      neighbors.push(nodes[row][col - 1]);
    }

    return neighbors;
  }
  function reconstructPath(endNode) {
    if (!endNode.cameFrom) {
      return [];
    }

    var currentNode = endNode;
    var path = [];

    while (currentNode) {
      path.push([currentNode.col, currentNode.row]);
      currentNode = currentNode.cameFrom;
    }

    return path.reverse();
  }
  // Minimum heap class
  class MinHeap {
    constructor(array) {
      // Create map of all nodes and their position within the heap.
      this.nodePositionsInHeap = new Map();
      for (var i = 0; i < array.length; i++) {
        this.nodePositionsInHeap[array[i].id] = i;
      }
      this.heap = this.buildHeap(array);
    }
    isEmpty() {
      return this.heap.length === 0 ? true : false;
    }
    buildHeap(array) {
      var firstParentIdx = Math.floor((array.length - 1) / 2)
      for (var i = firstParentIdx; i >= 0; i--) {
        this.siftDown(i, array.length - 1, array)
      }
      return array
    }
    siftDown(currentIdx, endIdx, heap) {
      var childOneIdx = currentIdx * 2 + 1;
      while (childOneIdx <= endIdx) {
        var childTwoIdx = currentIdx * 2 + 2 <= endIdx ? currentIdx * 2 + 2 : -1;
        var idxToSwap;
        if (childTwoIdx != -1 && heap[childTwoIdx].estimatedDistanceToEnd < heap[childOneIdx].estimatedDistanceToEnd) {
          idxToSwap = childTwoIdx;
        } else {
          idxToSwap = childOneIdx;
        }
        if (heap[idxToSwap].estimatedDistanceToEnd < heap[currentIdx].estimatedDistanceToEnd) {
          this.swap(currentIdx, idxToSwap, heap);
          currentIdx = idxToSwap;
          childOneIdx = currentIdx * 2 + 1;
        } else {
          return;
        }
      }
    }
    siftUp(currentIdx, heap) {
      var parentIdx = Math.floor((currentIdx - 1) / 2);
      while (currentIdx > 0 && heap[currentIdx].estimatedDistanceToEnd < heap[parentIdx].estimatedDistanceToEnd) {
        this.swap(currentIdx, parentIdx, heap);
        currentIdx = parentIdx;
        parentIdx = Math.floor((currentIdx - 1) / 2);
      }
    }
    remove() {
      if (this.isEmpty()) {
        return;
      }

      this.swap(0, this.heap.length - 1, this.heap);
      var node = this.heap.pop();
      delete this.nodePositionsInHeap[node.id];
      this.siftDown(0, this.heap.length - 1, this.heap);
      return node;
    }
    insert(node) {
      this.heap.push(node)
      this.nodePositionsInHeap[node.id] = this.heap.length - 1;
      this.siftUp(this.heap.length - 1, this.heap);
    }
    swap(i, j, heap) {
      this.nodePositionsInHeap[heap[i].id] = j;
      this.nodePositionsInHeap[heap[j].id] = i;
      [heap[i], heap[j]] = [heap[j], heap[i]];
    }
    containsNode(node) {
      return this.nodePositionsInHeap.has(node.id);
    }
    update(node) {
      this.siftUp(this.nodePositionsInHeap[node.id], this.heap);
    }
  }

  //****************//

  // Increase the snakes size once an apple is eaten.
  const growSnake = () => {
    let newSnake = [...snakeCoordinates];

    // Add and empty array at the start of the snake array to increase the length as the last element is cut off each move.
    // The empty array added will then be cut off instead of a snake body coordinates array.
    newSnake.unshift([])
    setSnakeCoordinates(newSnake);
  }
  
  const checkIfAppleEaten = () => {
    let head = snakeCoordinates[snakeCoordinates.length - 1];

    if (head[0] == appleCoordinates[0] && head[1] == appleCoordinates[1]) {
      setAppleCoordinates(getRandomCoordinates());
      growSnake();
    }
  }

  // Handles the game over state of the game.
  const gameOver = () => {
    alert(`Game Over! Your snake length was ${snakeCoordinates.length}.`);
    resetGame();
  }

  // Check if the snake is moving at of the specified play area.
  const checkOutOfBounds = () => {
    let head = snakeCoordinates[snakeCoordinates.length - 1];
    if (head[0] >= gridSize || head[1] >= gridSize || head[0] < 0 || head[1] < 0) {
      gameOver();
    }
  }

  // Checks if the snake collides with its own body while moving.
  const checkSelfCollision = () => {
    let snakeBody = [...snakeCoordinates];
    let head = snakeBody[snakeBody.length - 1];
    snakeBody.pop();
    snakeBody.forEach(body => {
      if (head[0] == body[0] && head[1] == body[1]) {
        gameOver();
      }
    })
  }

  // Use Effect section. **************
  // Handle all the game checks after each render.
  React.useEffect(() => {
    checkOutOfBounds();
    checkSelfCollision();
    checkIfAppleEaten();
    snakeLogic();
  })

  // Contains the game interval which dictates each frame of the game.
  React.useEffect(() => {
  const gameInterval = setInterval(() => {moveSnake()}, speed);
    return () => clearInterval(gameInterval);
  });

  // Detects user arrow key input.
  React.useEffect(() => {
    window.addEventListener('keydown', (event) => {
      event = event || window.event;
      switch (event.keyCode) {
        case 38:
          setDirection('UP');
          break;
        case 40:
          setDirection('DOWN');
          break;
        case 37:
          setDirection('LEFT');
          break;
        case 39:
          setDirection('RIGHT');
          break;
      } 
    });
  });
  // ***********************************

  return (
    <div className='App'>
      <div className='game-area'>
        <Snake snakeCoordinates={snakeCoordinates} direction={direction} pixelGridSize={pixelGridSize} />
        <Apple appleCoordinates={appleCoordinates} />
      </div>
    </div>
  );
}

export default App;
