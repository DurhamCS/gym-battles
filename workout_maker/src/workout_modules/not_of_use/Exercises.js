import exerciseData from "./Exercisedata"
import Exercise from "./Exercise"
import React from "react"
import { Container, Row, Col } from 'react-grid-system';


class Exercises extends React.Component{
    constructor() {
        super()
        this.state = {
            exec: exerciseData.map(prop => <Exercise name={prop.name} key={prop.id} />) 
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col sm={3}>
                            {this.state.exec[0]}
                        </Col>
                        <Col sm={3}>
                            {this.state.exec[1]}
                        </Col>
                        <Col sm={3}>
                            {this.state.exec[2]}
                        </Col>
                        <Col sm={3}>
                            {this.state.exec[3]}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }    
}

export default Exercises;