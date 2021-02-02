import React from 'react';

const Apple = (props) => {

    const style = {
        left: `${props.appleCoordinates[0]*2}%`,
        top: `${props.appleCoordinates[1]*2}%`
    }
    return (
        <div className="apple-body" style={style}></div>
    )
}

export default Apple;
