import React from 'react';

function Spacer(props) {
    return <div>
        {props.type === 'horizontal' ?
            <span style={{display:'inline-block', width: props.size}}/> : <div style={{height: props.size}}/>}
    </div>
}

export default Spacer;