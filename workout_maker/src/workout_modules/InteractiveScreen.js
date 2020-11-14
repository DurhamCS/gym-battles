import React from "react"

class InteractiveScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            noExercises: true,
            activeBoxes: 0,
            //state regarding the exercise blocks
        }
    }

    Instructions() {
        {
            if (this.state.noExercises) {
                return <main>Drag the exercises you want <br/> to do!</main>
            }
            else {
                return <main>Drag more exercises, <br/> if you dare!</main>
            }
        }
    }

    render() {
        return (
            //display block
            <div className="box">
                <div>
                    {this.Instructions()}
                </div>
            </div>
        );
    }    
}

export default InteractiveScreen;