import React from "react"
import Exercises from "./Exercises"
import "./ModStyles.css"
import Draggable from "react-draggable";
import { Container, Row, Col } from 'react-grid-system';


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
            <div >
                <div className="InteracticeScreen">
                    <Container>
                        <Col>
                            <Row className="Row" sm={6}>
                            </Row>
                            <hr></hr>
                            <Row className="Row" sm={6}>
                            </Row>
                            <hr></hr>
                            <Row className="Row" sm={6}>
                            </Row>
                            <hr></hr>
                            <Row className="Row" sm={6}>
                            </Row>
                            <hr></hr>
                            <Row className="Row" sm={6}>
                            </Row>
                            <hr></hr>
                            <Row className="Row" sm={6}>
                            </Row>
                            <hr></hr>
                        </Col>
                    </Container>
                    {this.Instructions()}
                    <button className="button">Save setup</button>
                    <button className="button">Clear setup</button>
                    <button className="button">Continue</button>
                </div>
                <div className="Exercises">
                    <Exercises />
                 </div>
            </div>
        );
    }    
}

export default InteractiveScreen;