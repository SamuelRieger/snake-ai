import React from 'react';
import snakeHead from '../resources/snake-head.svg';

const Snake = (props) => {
    return (
        <div>
            {props.snakeCoordinates.map((body, i) => {
                const cellPercentageWidth = 2;

                // Set current position for each snake body part.
                const style = {
                    left: `${body[1] * cellPercentageWidth}%`,
                    top: `${body[0] * cellPercentageWidth}%`,
                };

                // Set triangle style as per current direction.
                var styleDirection;
                switch (props.direction) {
                    case "UP":
                        styleDirection = {
                            left: `${body[1] * cellPercentageWidth - 0.8}%`,
                            top: `${body[0] * cellPercentageWidth - 1.6 - 0.1}%`,
                            transform: 'rotate(180deg)',
                        };
                        break;
                    case "DOWN":
                        styleDirection = {
                            left: `${body[1] * cellPercentageWidth - 0.8}%`,
                            top: `${body[0] * cellPercentageWidth + 0.1}%`,
                        };
                        break;
                    case "RIGHT":
                        styleDirection = {
                            left: `${body[1] * cellPercentageWidth + 0.1}%`,
                            top: `${body[0] * cellPercentageWidth - 0.8}%`,
                            transform: 'rotate(-90deg)',
                        };
                        break;
                    case "LEFT":
                        styleDirection = {
                            left: `${body[1] * cellPercentageWidth - 1.6 - 0.1}%`,
                            top: `${body[0] * cellPercentageWidth - 0.8}%`,
                            transform: 'rotate(90deg)',
                        };
                        break;
                }

                // Return snake body or head.
                if (i === props.snakeCoordinates.length - 1) {
                    return (
                        <img src={snakeHead} alt='snake' className='snake-head' style={styleDirection}/>
                    )
                }
                return (
                    <div className='snake-body' key={i} style={style}></div>
                )
            })}
        </div>
    )
}

export default Snake;