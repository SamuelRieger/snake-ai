import React from 'react';

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
                            borderLeft: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            borderRight: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            borderBottom: `${cellPercentageWidth * 0.01 * props.pixelGridSize}px solid #000`,
                            left: `${body[1] * cellPercentageWidth + 0.2}%`,
                            top: `${body[0] * cellPercentageWidth + 0.3}%`,
                        };
                        break;
                    case "DOWN":
                        styleDirection = {
                            borderTop: `${cellPercentageWidth * 0.01 * props.pixelGridSize}px solid #000`,
                            borderLeft: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            borderRight: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            left: `${body[1] * cellPercentageWidth + 0.2}%`,
                            top: `${body[0] * cellPercentageWidth - 0.2}%`,
                        };
                        break;
                    case "RIGHT":
                        styleDirection = {
                            borderTop: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            borderLeft: `${cellPercentageWidth * 0.01 * props.pixelGridSize}px solid #000`,
                            borderBottom: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            left: `${body[1] * cellPercentageWidth + 0.1}%`,
                            top: `${body[0] * cellPercentageWidth + 0.2}%`,
                        };
                        break;
                    case "LEFT":
                        styleDirection = {
                            borderTop: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            borderRight: `${cellPercentageWidth * 0.01 * props.pixelGridSize}px solid #000`,
                            borderBottom: `${cellPercentageWidth * 0.01/2 * props.pixelGridSize}px solid transparent`,
                            left: `${body[1] * cellPercentageWidth + 0.4}%`,
                            top: `${body[0] * cellPercentageWidth + 0.2}%`,
                        };
                        break;
                }

                // Set current style.
                var currentStyle;
                if (i === props.snakeCoordinates.length - 1) {
                    // currentStyle = Object.assign({}, styleDirection, style);
                    currentStyle = styleDirection;
                }else {
                    currentStyle = style;
                }

                // Set current class.
                const currentClass = i === props.snakeCoordinates.length - 1 ? "snake-head" : "snake-body";

                // Return snake body classes.
                return (
                    <div className={currentClass} key={i} style={currentStyle}></div>
                )
            })}
        </div>
    )
}

export default Snake;