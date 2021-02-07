import React, { useEffect, useState } from "react";
import Snake from './components/Snake.js';
import Apple from './components/Apple.js';
import { findAllByDisplayValue } from "@testing-library/react";

function App() {

  // Get a random coordinate for the apple where the snake's body does not occupy.
  const getRandomCoordinates = () => {
    let freeGridSpaces = getFreeGridSpaces();
    let gridCode = Math.floor((Math.random() * freeGridSpaces.length));

    return [freeGridSpaces[gridCode] % 50, Math.floor(freeGridSpaces[gridCode] / 50)];
  }

  // Get all the spaces on the board that the snake body does not occupy.
  const getFreeGridSpaces = () => {
    let gridSpaces = Array.from(Array(gridSize * gridSize).keys());

    for (var i = snakeCoordinates.length - 1; i >= 0; i--) {
      let key = snakeCoordinates[i][0] + snakeCoordinates[i][1] * gridSize;
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
      [1, 0]
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
        [1, 0]
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
        head = [head[0] + 1, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 1, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 1];
        break;
      case 'UP':
        head = [head[0], head[1] - 1];
    }
    body.push(head);
    body.shift();
    setSnakeCoordinates(body);
    setUpdate(update => update + 1);
  }

  const snakeLogic = () => {
    //Snake algorithms and logic.
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
        this.heap.append(node)
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
  }

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
      snakeLogic();
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
