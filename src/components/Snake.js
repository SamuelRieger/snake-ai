import React from 'react';

const Snake = (props) => {
    return (
        <div>
            {props.snakeCoordinates.map((body, i) => {
                const style = {
                    left: `${body[0]*2}%`,
                    top: `${body[1]*2}%`
                }
                return (
                    <div className="snake-body" key={i} style={style}></div>
                )
            })}
        </div>
    )
}

export default Snake;