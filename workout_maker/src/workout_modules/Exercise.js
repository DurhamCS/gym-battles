import Draggable from "react-draggable";

function Exercise(props) {
    return (
    <div style={{ height: 20}}>
        <Draggable defaultPosition={{x: 0, y: 0}} position={null}>
                <div>
                    <h4 style={{ height: 20}}>{props.exer}</h4>
                </div>
        </Draggable>
    </div>
    )
}

export default Exercise;