

function Exercise(props) {

    
    return (
    <div style={{ height: 20}}>
        <Draggable grid={[30, 15]} >
                <div>
                    <h4 style={{ height: 10}}>{props.name}</h4>
                </div>
        </Draggable>
    </div>
    )
}

export default Exercise;