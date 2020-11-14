import exerciseData from "./Exercisedata"
import Exercise from "./Exercise"
import { Container, Row, Col } from 'react-grid-system';


function Exercises() {
    const exerciseComponents = exerciseData.map(prop => <Exercise name={prop.name} key={prop.id} />)
    return (
        <div>
            <Container>
                <Row>
                    <Col sm={3}>
                        {exerciseComponents[0]}
                    </Col>
                    <Col sm={3}>
                        {exerciseComponents[1]}
                    </Col>
                    <Col sm={3}>
                        {exerciseComponents[2]}
                    </Col>
                    <Col sm={3}>
                        {exerciseComponents[3]}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Exercises;