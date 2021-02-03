import React, { useEffect, useState } from "react";
import Snake from './components/Snake.js';
import Apple from './components/Apple.js';

function App() {

  const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2);
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2);
    return [x, y];
  }

  const [snakeCoordinates, setSnakeCoordinates] = useState(
    [
      [0, 0],
      [1, 0],
      [2, 0]
    ]
  );

  const [direction, setDirection] = useState(
    'RIGHT'
  );

  const [speed, setSpeed] = useState(
    500
  );

  const [appleCoordinates, setAppleCoordinates] = useState(
    getRandomCoordinates()
  );

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
    console.log(body);
    setSnakeCoordinates(body);
  }

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

  React.useEffect(() => {
    const gameInterval = setInterval(() => moveSnake(), speed);
  });

  return (
    <div className='App'>
      <div className='game-area'>
        <Snake snakeCoordinates={snakeCoordinates} />
        <Apple appleCoordinates={appleCoordinates} />
      </div>
    </div>
  );
}

export default App;
