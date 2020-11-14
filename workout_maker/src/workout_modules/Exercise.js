import Draggable from "react-draggable";

function Exercise(props) {
    function handleStart() {
        return (
            <div>
                <h4 style={{ height: 10}}>{props.name}</h4>
             </div>
        )
    }

    function handleStop() {
        return (
            <div>
                <h4 style={{ height: 10}}>{props.name}</h4>
             </div>
        )
    } 
       
    return (
    <div style={{ height: 20}}>
        <Draggable defaultPosition={{x: 0, y: 0}} position={null} onStart={handleStart} onStop={handleStop}>
                <div>
                    <h4 style={{ height: 10}}>{props.name}</h4>
                </div>
        </Draggable>
    </div>
    )
}

export default Exercise;